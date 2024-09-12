//importing modules
const jwt = require("jsonwebtoken");
const db = require("../models");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const functionFromModule = require('../helper_utils/tokenVerifier.js');
const helperUtils = require('../helper_utils/helperUtils');
const encryptingAndDecrypting = require('../helper_utils/projectUtils.js');


const { getAllLogData, getAllUserDetails } = require('../DbQuery/dbOperationsUser.js');


const path = require('path');
require('dotenv').config();
const Sequelize = require('sequelize');




const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
const User = db.users;

/*

{
    "username" : "11001@abc.com",
    "password" : "123"
    
}
*/
//login authentication
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username: username } });
        if (user) {
            if (user.isActive == '1') {

                const isSame = encryptingAndDecrypting.encrypt(password) == user.password ? true : false;
                if (isSame) {
                    const accessToken = jwt.sign(
                        { username: user.username, gender: user.gender, role: user.role, id: user.id },
                        ACCESS_TOKEN_SECRET,
                        { expiresIn: ACCESS_TOKEN_EXPIRY }
                    );

                    const userResponse = {
                        username: user.username,
                        gender: user.gender,
                        role: user.role,
                        createdAt: user.createdAt,
                        token: accessToken
                    }

                    res.status(200).send({ msg: 'Login successful', statusCode: true, response: userResponse });

                } else {
                    res.status(401).send({ msg: 'Authentication failed', statusCode: false });
                }
            } else {
                res.status(401).send({ msg: 'Authentication failed.User not active yet', statusCode: false });
            }
        } else {
            res.status(401).send({ msg: 'Authentication failed', statusCode: false });
        }
    } catch (error) {
        res.status(500).send({ msg: 'Please check the input parameters passed', statusCode: false });
    }
}


/*

{
    "username" : "11001@abc.com",
    "password" : "123",
    "gender" : "F",
    "organization" : "C",
    "purpose" : "A"
    
}

*/


//signing a user up
//hashing users password before its saved to the database
const signup = async (req, res) => {
    try {
        var userActive = '1';
        const { username, gender, password, organization, purpose } = req.body;

        const data = { username, gender, password, organization, purpose };


        if (data.username == undefined || data.username == '') {
            return res.status(403).send({ message: "Username cannot be blank", statusCode: false });
        }

        // var isSpecialChar = helperUtils.hasSpecialCharacters(data.username);
        // if (isSpecialChar) {

        // } else {
        //     return res.status(403).send({ message: "In username only @ special character is allowed.", statusCode: false });
        // }



        var isSpecialChar = helperUtils.checkSpecialCharter(data.username);
        if (isSpecialChar) {
            return res.status(403).send({ message: "In username only @ special character is allowed.", statusCode: false });
        } 


        var isSpecialChar = helperUtils.checkValidEmail(data.username);
        if (isSpecialChar) {
        } else{
            return res.status(403).send({ message: "In username please enter a valid username id.", statusCode: false });
        }

        

        if (data.gender == undefined || data.gender == '') {
            return res.status(403).send({ message: "Gender cannot be blank", statusCode: false });
        }
        if (data.password == undefined || data.password == '') {
            return res.status(403).send({ message: "Password cannot be blank", statusCode: false });
        }
        if (data.organization == undefined || data.organization == '') {
            return res.status(403).send({ message: "Organization cannot be blank", statusCode: false });
        }
        if (data.purpose == undefined || data.purpose == '') {
            return res.status(403).send({ message: "Purpose cannot be blank", statusCode: false });
        }


        if (req.headers['authorization'] == null) {
            // userActive = '0';
        }
        const emailcheck = await User.findOne({ where: { username: data.username } });
        // console.log("emailcheck", emailcheck)

        if (emailcheck) {
            return res.status(403).send({ message: "User already registered with this username", statusCode: false });
        }

      
       
        const newUser = new User({
            gender: data.gender,
            username: data.username,
            organization: data.organization,
            purpose: data.purpose,
            password: encryptingAndDecrypting.encrypt(data.password),
            role: 'users',
            isActive: userActive
        });



        newUser.save()
            .then((newUser) => {
                return res.status(200).send({ msg: 'User registered successfully.', statusCode: true, response: newUser });
            })
            .catch((error) => {
                // console.log("error", error)
                return res.status(400).send({ msg: error + 'Invalid request body!', statusCode: false });
            });

    } catch (error) {
        res.status(500).json({ error: error + 'Please check the input parameters passed' });

    }

}



const getUser = async (req, res) => {

    try {

        var queryType = req.query.query;
        if (!queryType) {
            return res.status(409).send("?query=xxxx is required! NB: xxxx is all / username");
        }
        var isUserValid = true;
        // console.log("authorization", req.headers['authorization'])

        if (req.headers['authorization'] == null) {
            return res.status(400).send({ msg: 'Token not found. Invalid request!', statusCode: false });
        }

        const verifyToken = functionFromModule.verifyToken(req.headers['authorization']);
        // console.log("verifyToken",verifyToken)
        if (verifyToken == undefined ) {
            return res.status(400).send({ msg: 'Token not found. Invalid request!', statusCode: false });
        }
        
       if ( verifyToken.role.toLowerCase() != 'admin') {
        return res.status(400).send({ msg: 'only admin are authorized to query this api.', statusCode: false });
         }


        if (req.query.Format && req.query.Format.toLowerCase() === 'json') {

            try {
                if (queryType == 'all') {
                    const users = await User.findAll();
                    if (users) {
                        return res.status(200).json(users);
                    } else {
                        return res.status(400).send("Invalid request body");
                    }
                } else {
                    const user = await User.findOne({
                        where: {
                            username: queryType
                        },
                        attributes: { exclude: ['password'] }
                    });
                    if (user) {
                        return res.status(200).json(user);
                    } else {
                        return res.status(400).send("Invalid request body");
                    }
                }
            } catch (error) {
                return res.status(500).send("" + error);
            }

        } else {


            try {
                if (queryType == 'all') {
                    var users = await getAllUserDetails(isUserValid);
                    // console.log("authorization", req.headers['authorization'])
                    if (users) {
                        const filePath = process.cwd() + "/logs/";
                        const csvWriter = createCsvWriter({
                            path: path.resolve(filePath + 'userDetails.csv'), // Resolve to an absolute path
                            header: Object.keys(users[0]).map(key => ({ id: key, title: key })),
                        });
                        await csvWriter.writeRecords(users);
                        res.status(200).sendFile(path.resolve(filePath + 'userDetails.csv'));

                    } else {
                        return res.status(400).send("Invalid request body");
                    }
                } else {
                    const user = await User.findOne({
                        where: {
                            username: queryType
                        },
                        attributes: { exclude: ['password'] }
                    });
                    if (user) {
                        const filePath = process.cwd() + "/logs/";
                        const csvWriter = createCsvWriter({
                            path: path.resolve(filePath + 'userDetails.csv'), // Resolve to an absolute path
                            header: Object.keys(users[0]).map(key => ({ id: key, title: key })),
                        });
                        await csvWriter.writeRecords(users);
                        res.status(200).sendFile(path.resolve(filePath + 'userDetails.csv'));
                        return res.status(200).json(user);
                    } else {
                        return res.status(400).send("Invalid request body");
                    }
                }
            } catch (error) {
                return res.status(500).send("" + error);
            }


        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }


}

const updateUser = async (req, res) => {

    var updateItem = req.params.username;
    // console.log("authorization", req.headers['authorization'])
   

    if (req.headers['authorization'] == null) {
        return res.status(400).send({ msg: 'Token not found. Invalid request!', statusCode: false });
    }

    const verifyToken = functionFromModule.verifyToken(req.headers['authorization']);

    // console.log("verifyToken", verifyToken)
    if (verifyToken == undefined) {
        return res.status(400).send({ msg: 'Token not found. Invalid request!', statusCode: false });
    }

    if ( verifyToken.role.toLowerCase() != 'admin') {
        return res.status(400).send({ msg: 'only admin are authorized to query this api.', statusCode: false });
    }

    try {
        const user = await User.findOne({
            where: { username: updateItem }
        });

        // console.log("user", user)

        if (!user) {
            return res.status(409).send({ msg: "Requested " + updateItem + " wasn't found!", statusCode: false });
        }
        const checkSameUser = await User.findOne({
            where: {
                username: user.username
            }
        });

        // console.log("checkSameUser", checkSameUser)


        if (checkSameUser && updateItem != user.username) {
            return res.status(403).send({ msg: "Requested " + username + " is duplicate, please change and retry it.", statusCode: false });
        }


        if (checkSameUser.isActive == 1) {
            await User.update({ isActive: '0' },
                {
                    where: { username: updateItem }
                }
            );
            return res.status(200).send({ msg: 'User inactived successfully', statusCode: true });
        } else {

            await User.update({ isActive: '1' },
                {
                    where: { username: updateItem }
                }
            );
            return res.status(200).send({ msg: 'User actived successfully', statusCode: true });
        }

    } catch (error) {
        // console.log("error", error)
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
}




const getAllLog = async (req, res) => {
    try {
        var getAllLog = [];
        var isUserValid = true;

        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }

        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
            return res.status(400).send({ msg: 'Token not found. Invalid request!', statusCode: false });
        }
        if ( data.role.toLowerCase() != 'admin') {
            return res.status(400).send({ msg: 'only admin are authorized to query this api.', statusCode: false });
             }

        getAllLog = await getAllLogData(isUserValid);


        const filePath = process.cwd() + "/";
        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {

            if (!getAllLog.length) {
                res.status(200).send({
                    data: getAllLog,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'log.csv'), // Resolve to an absolute path
                    header: Object.keys(getAllLog[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(getAllLog);
                res.status(200).sendFile(path.resolve(filePath + 'log.csv')); // Resolve to an absolute path

            }

        } else {
            if (!getAllLog.length) {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: getAllLog,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};





module.exports = {
    login,
    signup,
    getUser,
    updateUser,
    getAllLog
};