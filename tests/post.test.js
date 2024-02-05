const sinon = require('sinon');
const PostModel = require('../models/post.model');
const PostController = require('../controllers/post.controller');

describe('Post controller', () => {
    // Setup the responses
    let req = {
        body: {
            author: 'stswenguser',
            title: 'My first test post',
            content: 'Random content'
        }
    };

    let error = new Error({ error: 'Some error message' });

    let res = {};

    let expectedResult;

    
    describe('create', () => {
        var createPostStub;

        beforeEach(() => {
            // before every test case setup first
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            // executed after the test case
            createPostStub.restore();
        });


        it('should return the created post object', () => {
            // Arrange
            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            createPostStub = sinon.stub(PostModel, 'createPost').yields(null, expectedResult);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));

        });


        // Error Scenario
        it('should return status 500 on server error', () => {
            // Arrange
            createPostStub = sinon.stub(PostModel, 'createPost').yields(error);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('update', () => {
        var updatePostStub;

        beforeEach(() => {
            // before every test case setup first
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            // executed after the test case
            updatePostStub.restore();
        });

        // Test for retrieving the post to edit
        it('should retrieve the post', () =>{
            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, expectedResult);

            // Act
            PostController.update(req, res);

            // Assert
            sinon.assert.calledWith(updatePostStub, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));
        })

        // Test for handling errors
        it('should handle errors during updates', () => {
            const error = new Error('Update failed');
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(error, null);

            // Mocking the request object
            const req = {
                body: {
                    title: 'My updated test post',
                    content: 'Updated content',
                    author: 'stswenguser'
                }
            };

            // Act
            PostController.update(req, res);

            // Assert
            sinon.assert.calledWith(updatePostStub, req.body);
            sinon.assert.calledWith(res.status, 500); // Assuming you set a 500 status for errors
            sinon.assert.calledWith(res.json, sinon.match({ error: 'Update failed' }));
        });

        it('should handle non-existent post during update', () => {
            const expectedResult = null; // Simulating a non-existent post
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, expectedResult);

            // Mocking the request object
            const req = {
                body: {
                    title: 'My updated test post',
                    content: 'Updated content',
                    author: 'stswenguser'
                }
            };

            // Act
            PostController.update(req, res);

            // Assert
            sinon.assert.calledWith(updatePostStub, req.body);
            sinon.assert.calledWith(res.status, 404); // Assuming you set a 404 status for not found
            sinon.assert.calledWith(res.json, sinon.match({ error: 'Post not found' }));
        });


        it('should handle successful update', () => {
            const expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My updated test post',
                content: 'Updated content',
                author: 'stswenguser',
                date: Date.now()
            };

            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, expectedResult);

            // Mocking the request object
            const req = {
                body: {
                    title: 'My updated test post',
                    content: 'Updated content',
                    author: 'stswenguser'
                }
            };

            // Act
            PostController.update(req, res);

            // Assert
            sinon.assert.calledWith(updatePostStub, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));
        });


        
    });

    describe('findPost', () => {

    })
});