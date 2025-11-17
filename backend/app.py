from flask import Flask, request, jsonify
from models import db, User, Project
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flasgger import Swagger, swag_from

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'

Swagger(app)  # Initialize Swagger

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

# ----------------------
# Register User
# ----------------------
@app.route('/register', methods=['POST'])
@swag_from({
    'tags': ['User'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'password': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {201: {'description': 'User registered successfully'}}
})
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# ----------------------
# Login User
# ----------------------
@app.route('/login', methods=['POST'])
@swag_from({
    'tags': ['User'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'username': {'type': 'string'},
                    'password': {'type': 'string'}
                }
            }
        }
    ],
    'responses': {200: {'description': 'JWT token'}}
})
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        token = create_access_token(identity=username)
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid username or password'}), 401

# ----------------------
# Create Project
# ----------------------
@app.route('/project', methods=['POST'])
@jwt_required()
@swag_from({
    'tags': ['Project'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'status': {'type': 'string'},
                    'type': {'type': 'string'}
                },
                'required': ['name', 'status', 'type']
            }
        }
    ],
    'responses': {
        201: {'description': 'Project created successfully'},
        401: {'description': 'Unauthorized'}
    }
})
def create_project():
    data = request.json
    name = data.get('name')
    status = data.get('status')
    type_ = data.get('type')
    tester = get_jwt_identity()
    new_project = Project(name=name, status=status, type=type_, tester=tester)
    db.session.add(new_project)
    db.session.commit()
    return jsonify({'message': 'Project created successfully'}), 201


# ----------------------
# Get Projects
# ----------------------
@app.route('/projects', methods=['GET'])
@jwt_required()
@swag_from({
    'tags': ['Project'],
    'responses': {
        200: {
            'description': 'List of projects for the logged-in user',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'integer'},
                        'name': {'type': 'string'},
                        'status': {'type': 'string'},
                        'type': {'type': 'string'},
                        'tester': {'type': 'string'}
                    }
                }
            }
        },
        401: {'description': 'Unauthorized'}
    }
})
def get_projects():
    username = get_jwt_identity()
    projects = Project.query.filter_by(tester=username).all()
    result = [{'id': p.id, 'name': p.name, 'status': p.status, 'type': p.type, 'tester': p.tester} for p in projects]
    return jsonify(result), 200


# ----------------------
# Run Flask
# ----------------------
if __name__ == '__main__':
    app.run(debug=True)
