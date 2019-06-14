from app import create_app

app = create_app()

# this will allow us to run the app with python
if __name__ == '__main__':
    app.run(debug=True)
