from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, DateField, SubmitField
from wtforms.validators import DataRequired

class DomainForm(FlaskForm):
    name = StringField('Domain Name', validators=[DataRequired()])
    submit = SubmitField('Add Domain')

class SubDomainForm(FlaskForm):
    domain = StringField('Parent Domain', validators=[DataRequired()])
    name = StringField('Sub-Domain Name', validators=[DataRequired()])
    submit = SubmitField('Add Sub-Domain')

class ClusterForm(FlaskForm):
    domain = StringField('Parent Domain', validators=[DataRequired()])
    sub_domain = StringField('Sub-Domain (optional)', validators=[])
    name = StringField('Cluster Name', validators=[DataRequired()])
    type = SelectField('Type', choices=[('role', 'Role'), ('project', 'Project')])
    submit = SubmitField('Add Cluster')

class NodeForm(FlaskForm):
    domain = StringField('Parent Domain', validators=[DataRequired()])
    sub_domain = StringField('Sub-Domain (optional)', validators=[])
    cluster = StringField('Cluster Name', validators=[DataRequired()])
    id = StringField('Node ID', validators=[DataRequired()])
    group = SelectField('Group', choices=[('certification', 'Certification'), ('skill', 'Skill'), ('degree', 'Degree'), ('project', 'Project'), ('role', 'Role')])
    lane = StringField('Lane (Discipline)', validators=[])
    acquired_date = DateField('Acquired Date', format='%Y-%m-%d')
    submit = SubmitField('Add Node')

class LinkForm(FlaskForm):
    source = StringField('Source Node ID', validators=[DataRequired()])
    target = StringField('Target Node ID', validators=[DataRequired()])
    type = SelectField('Link Type', choices=[('lane', 'Lane'), ('discipline', 'Discipline')])
    lane_or_discipline = StringField('Lane/Discipline Name', validators=[DataRequired()])
    submit = SubmitField('Add Link')
