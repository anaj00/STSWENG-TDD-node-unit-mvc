const mongoose = require('./connection');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
  }
);

const Post = mongoose.model('posts', postSchema);

exports.createPost = (obj, next) => {
    const post = new Post(obj);

    post.save(function(err, post) {
        next(err, post)
    }) 
}

exports.updatePost = (obj, next) => {
    const postId = obj._id;
    
    Post.findByIdAndUpdate(postId, { $set: obj }, { new: true }, (err, updatedPost) => {
        if (err) {
            // Handle the error and return an appropriate response
            return next(new Error(errorMessage), { status: 500, error: "Update Failed" });        }

        if (!updatedPost) {
            // If the post was not found, return an appropriate response
            const notFoundMessage = 'Post not found';
            return next(new Error(notFoundMessage), { status: 404, error: "Post not found" });
        }

        // Return the updated post if the update was successful
        next(null, updatedPost);
    });
};

