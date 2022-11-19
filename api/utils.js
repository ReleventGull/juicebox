

const requireUser = (req, res, next) => {
    if (!req.user) {
        console.log("There is no user set")
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        })
    }
    console.log("User is set", req.user.id)
    next(); 
}

module.exports = {
    requireUser
}