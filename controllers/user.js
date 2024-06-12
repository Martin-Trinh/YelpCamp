const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) =>{
    res.render('users/register')   
}

module.exports.registerUser = async (req, res) =>{
    try{
        const {username, password, email} = req.body
        const user =  new User ({email, username})
        const newUser  = await User.register(user, password)
        req.login(newUser ,function (err){
            if(err) return next(err)
            req.flash('success', 'Welcome to campgrounds')
            res.redirect('campgrounds')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) =>{
    res.render('users/login')
}

module.exports.loginUser = (req, res) =>{
    req.flash('success', 'Login successfuly')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) =>{
    req.logout(function (err){
        if(err){
            return next(err)
        }
        req.flash('success', "Succesfully logout")
        res.redirect('/campgrounds')

    })
}