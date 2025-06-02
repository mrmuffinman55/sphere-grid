from flask import render_template, jsonify, request, redirect, url_for
from app.forms import DomainForm, SubDomainForm, ClusterForm, NodeForm, LinkForm
import json
import os
from app import app

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_FILE = os.path.join(BASE_DIR, '..', 'data.json')

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"domains": [], "links": []}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/spheregrid')
def spheregrid_data():
    data = load_data()
    # Flatten domains, subdomains, clusters, nodes
    nodes = []
    for domain in data.get('domains', []):
        # Domain-level clusters
        for cluster in domain.get('clusters', []):
            for node in cluster.get('nodes', []):
                node_data = node.copy()
                node_data.update({
                    "cluster": cluster["name"],
                    "domain": domain["name"],
                    "sub_domain": None
                })
                nodes.append(node_data)
        # Sub-domain clusters
        for sub_domain in domain.get('sub_domains', []):
            for cluster in sub_domain.get('clusters', []):
                for node in cluster.get('nodes', []):
                    node_data = node.copy()
                    node_data.update({
                        "cluster": cluster["name"],
                        "domain": domain["name"],
                        "sub_domain": sub_domain["name"]
                    })
                    nodes.append(node_data)
    return jsonify({
        "nodes": nodes,
        "links": data.get('links', [])
    })

@app.route('/add_domain', methods=['GET', 'POST'])
def add_domain():
    form = DomainForm()
    if form.validate_on_submit():
        data = load_data()
        new_domain = {
            "name": form.name.data,
            "clusters": [],
            "sub_domains": []
        }
        data['domains'].append(new_domain)
        save_data(data)
        return redirect(url_for('index'))
    return render_template('add_domain.html', form=form)

@app.route('/add_subdomain', methods=['GET', 'POST'])
def add_subdomain():
    form = SubDomainForm()
    if form.validate_on_submit():
        data = load_data()
        for domain in data['domains']:
            if domain['name'] == form.domain.data:
                new_subdomain = {
                    "name": form.name.data,
                    "clusters": []
                }
                domain['sub_domains'].append(new_subdomain)
                break
        save_data(data)
        return redirect(url_for('index'))
    return render_template('add_subdomain.html', form=form)

@app.route('/api/add_cluster', methods=['POST'])
def add_cluster():
    data = load_data()
    new_cluster = request.get_json(force=True)

    if not new_cluster.get('name') or not new_cluster.get('type'):
        return jsonify({"success": False, "message": "Missing fields."})

    # Add to first domain for now
    if data['domains']:
        domain = data['domains'][0]
        # Check if cluster already exists
        for cluster in domain.get('clusters', []):
            if cluster['name'] == new_cluster['name']:
                return jsonify({"success": False, "message": "Cluster already exists."})

        new_cluster_obj = {
            "name": new_cluster['name'],
            "type": new_cluster['type'],
            "nodes": []
        }
        domain['clusters'].append(new_cluster_obj)
        save_data(data)
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "No domain exists to add cluster."})

@app.route('/api/add_node', methods=['POST'])
def add_node():
    data = load_data()
    new_node = request.get_json(force=True)

    # Duplicate check: prevent exact duplicate
    for domain in data.get('domains', []):
        for cluster in domain.get('clusters', []):
            for node in cluster.get('nodes', []):
                if (node['id'] == new_node['id'] and
                    node['group'] == new_node['group'] and
                    node['lane'] == new_node['lane'] and
                    node['acquired_date'] == new_node['acquired_date']):
                    return jsonify({"success": False, "message": "Duplicate node exists."})

    # Add to first cluster for now (enhance later to select)
    if data['domains']:
        if data['domains'][0]['clusters']:
            data['domains'][0]['clusters'][0]['nodes'].append(new_node)
            save_data(data)
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "No cluster to add node into."})
    else:
        return jsonify({"success": False, "message": "No domain exists."})


@app.route('/add_link', methods=['GET', 'POST'])
def add_link():
    form = LinkForm()
    if form.validate_on_submit():
        data = load_data()
        link_obj = {
            "source": form.source.data,
            "target": form.target.data,
            "type": form.type.data
        }
        if form.type.data == 'lane':
            link_obj["lane"] = form.lane_or_discipline.data
        else:
            link_obj["discipline"] = form.lane_or_discipline.data
        data['links'].append(link_obj)
        save_data(data)
        return redirect(url_for('index'))
    return render_template('add_link.html', form=form)