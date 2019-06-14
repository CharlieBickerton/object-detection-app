from flask import Flask


def create_app():
    app = Flask(__name__)
    # app.config.from_object(Config) # import config variables and execute for app

    # db.init_app(app)
    # db_file_path = os.path.join(app.root_path, 'site.db')

    # if not os.path.isfile(db_file_path): # if there is no db create db
    #     print('db not found - creating db')
    #     db.create_all()
    # else:
    #     print('db already created')

    from app.main.routes import main
    app.register_blueprint(main)

    return app