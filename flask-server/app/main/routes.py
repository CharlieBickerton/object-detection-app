from flask import request, Blueprint

main = Blueprint('main', __name__)


# @main.route("/api/user/register/")
# def register():
#     page = request.args.get('page', 1, type=int)
#     posts = Post.query.order_by(Post.date_posted.desc()).paginate(page=page, per_page=5)
#     return render_template('home.html', posts=posts)


@main.route("/")
def about():
    return 'hi'