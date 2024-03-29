const router = require('express').Router();
require('dotenv');

const {User,Chat,Request,Message, ChatUser, Friendship} =require('../../models');

//routes for user
router.get('/user', async (req,res) =>{
    try{
        const userData = await User.findAll();
        const users = userData.map((user) => user.get({ plain: true }));

        if(users.length===0){
            res.status(404).json({message:'no users'});
        }
        else{
            res.status(200).json(users);
        };

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

router.get('/user/:id', async (req,res) =>{
    try{
        const userData = await User.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'friend1',
                    through: Friendship,
                },
                {
                    model: User,
                    as: 'friend2',
                    through: Friendship,
                }
            ]
        });
        const user = userData.get({plain:true});

        if(!user){
            res.status(404).json({message:'No user of this id'});
        }
        else{res.status(200).json(user)};

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

//chat routes
router.get('/chat', async (req,res) =>{
    try{
        const chatData = await Chat.findAll();
        const chats = chatData.map((chat) => chat.get({ plain: true }));

        if(chats.length===0){
            res.status(404).json({message:'no chats'});
        }
        else{
            res.status(200).json(chats);
        };

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

router.get('/chat/:id', async (req,res) =>{
    try{
        const chatData = await User.findByPk(req.params.id);
        const chat = chatData.get({plain:true});

        if(!user){
            res.status(404).json({message:'No chat of this id'});
        }
        else{res.status(200).json(chat)};

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    };
})

router.post('/chat', async (req,res) =>{
    const {title,user1_id,user2_id} = req.body
    try{
        const chatData = await Chat.create(req.body);
        
        if(!chatData){
            res.status(404).json({message:'failed to post'});
        }
        else{
            res.status(200).json(chatData);
        };
    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

//message route
router.get('/chat/message/:chat_id', async (req, res) => {
    try{
        const messageData = await Message.findAll({
            where: {
                chat_id: req.params.chat_id,
            },
            include: [{
                model: User,
                as: 'author',
                attributes: ['username', 'id']
            }]
        });

        const chatMessages = messageData.map((message) => message.get({ plain: true }));

        res.status(200).json(chatMessages);
    }
    catch (err){
        console.error(err);
        res.status(500).json(err);
    }
})
router.get('/message/:id', async (req,res) =>{
    try{
        const messageData = await Message.findByPk(req.params.id);
        const message = messageData.get({plain:true});

        if(!message){
            res.status(404).json({message:'No message of this id'});
        }
        else{res.status(200).json(message)};

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    };
})

router.post('/message', async (req,res) =>{
    const{text,author_id,chat_id} = req.body
    try{
        const messageData = await Message.create(req.body);

        if(!messageData){
            res.status(404).json({message:'failed to post message'});
        }
        else{
            res.status(200).json(messageData);
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    };
})

//request routes
router.get('/request', async (req,res) =>{
    try{
        const requestData = await Request.findAll();
        const requests = requestData.map((request) => request.get({ plain: true }));

        if(requests.length===0){
            res.status(404).json({message:'no requests'});
        }
        else{
            res.status(200).json(requests);
        };

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

router.get('/request/:id', async (req,res) =>{
    try{
        const requestData = await User.findByPk(req.params.id);
        const request = requestData.get({plain:true});

        if(!request){
            res.status(404).json({message:'No request of this id'});
        }
        else{res.status(200).json(request)};

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    };
})

router.post('/request', async (req,res) =>{
    const {author_id,recipient_id, type, inviteChat_id} = req.body

    if(req.body.author_id !== undefined &&
        req.body.recipient_id !== undefined &&
        req.body.type !== undefined &&
        req.body.inviteChat_id !== null){
        try{
            const requestData = await Request.create(req.body);
    
            if(!requestData){
                res.status(404).json({message:'Failed to post request'});
            }
            else{
                res.status(200).json(requestData);
            }
    
        }
        catch (err) {
            console.error(err);
            res.status(500).json(err);
        };
    }
    else{
        res.status(400).json({message: 'bad request'});
    };
})

router.delete('/request/:id', async (req,res) =>{
    try{
        const requestData = await Request.destroy({
            where:{
                id:req.params.id
            }
        });

        if(!requestData){
            res.status(404).json({message:'Failed to delete request'});
        }
        else{res.status(200).json(requestData)};

    }
    catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})

// Post Route for Friendship
router.post('/friendship', async (req, res) => {
    const {friend1_id, friend2_id} = req.body;

    if(req.body.friend1_id && req.body.friend2_id){
        try{
            const friendshipData = Friendship.create(req.body);
    
            if(!friendshipData){
                res.status(404).json({message: 'error creating friendship'})
            }
            else{
                res.status(200).json(friendshipData);
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json(err);
        }
    }
    else{
        res.status(400).json({message: 'Bad request'});
    };
});


// Post route for chatuser
router.post('/chatuser', async (req, res) => {
    const {user_id, chat_id} = req.body;

    if(req.body.user_id && req.body.chat_id){
        try{
            const chatuserData = ChatUser.create(req.body);

            if(!chatuserData){
                res.status(404).json({message: 'something went wrong creating chatuser'});
            }
            else{
                res.status(200).json(chatuserData);
            };
        }
        catch (err) {
            console.error(err);
            res.status(500).json(err);
        };
    }
    else{
        res.status(400).json({message: 'bad request'});
    };
});

router.post('/oneword', async (req, res) => {
    const {word} = req.body;
    
    if(req.body.word){
        try{
            const word = req.body.word;
            const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/typeOf`;
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                }
            };

            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);

            if(response.status === 200){
                const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
                res.status(200).json({response: capitalizedWord});
            }
            else{
                res.status(200).json({response: 'badRequest'});
            };
        } 
        catch (err) {
            console.error(err);
            res.status(500).json(err);
        };
    }
    else{
        res.status(400).json({message: 'bad request'});
    }
});

module.exports = router;