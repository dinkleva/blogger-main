const { models } = require('mongoose');
const Blog = require('../models/blogs');
const User = require('../models/user')
const ars = require('arslugify')
const jwt = require('jsonwebtoken')
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete




const blog_index = (req, res) => {
    Blog.find().sort({createdAt: -1})
        .then((result) =>{
            res.render('blogs/index', {title: 'All Blogs', blogs: result});

        })
        .catch((err) => console.log(err))
}


const blog_details = (req, res) => {
    const id = req.params.id
    Blog.findById(id)
        .then((result) => {
            res.render('blogs/details', {title: 'Details Page', blog: result});
        })
        .catch((err) => {
            console.log(err)
        });
}


const blog_create_get = (req, res) => {
    res.render('blogs/create', { title: 'Blogs' });
}

const blog_create_post = async (req, res) => {

    //Getting token which is set after login so that we can extract the user's information
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) =>{
            const blog = new Blog(req.body)
            blog.slug = ars(req.body.title)
            const user = await User.findById(decodedToken.id)
            blog.author.id = user.blog_id
            blog.author.name = user.name

                blog.save()
                    .then((result) =>{
                        res.redirect('/blogs')
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                })

    }
    else{
        console.log('Not found the user')
    }

    

    
}

const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then((result) =>{
            res.json({ redirect: '/blogs'})
        })
        .catch(err => console.log(err));
}

module.exports = 
{
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
}