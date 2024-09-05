//importing modules
const db = require("../models/index.js");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const functionFromModule = require('../helper_utils/tokenVerifier.js');

const { getIndicatorRepo,getStateRepo,getNicRepo,getASIRecordsRepo } = require('../DbQuery/dbOperationASI.js');





const path = require('path');
require('dotenv').config();
const Sequelize = require('sequelize');





const getIndicator = async (req, res) => {
    try {
        var indicator = [];
        indicator = await getIndicatorRepo();

        if (!indicator.length) {
            res.status(200).send({
                data: indicator,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: indicator,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getStates = async (req, res) => {
    try {
        var state = [];
        state = await getStateRepo();

        if (!state.length) {
            res.status(200).send({
                data: state,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: state,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getNic = async (req, res) => {
    try {
        var nic = [];
        nic = await getNicRepo();

        if (!nic.length) {
            res.status(200).send({
                data: nic,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: nic,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};











const getASIData = async (req, res) => {

    try {
        var isUserValid = true;
        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }
        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }

        var  asiDetails = await getASIRecordsRepo(req, isUserValid);
        // console.log("final_query", asiDetails)
        

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {
            if (!asiDetails.length) {
                res.status(200).send({
                    data: asiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'asiData.csv'), // Resolve to an absolute path
                    header: Object.keys(asiDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(asiDetails);
                res.status(200).sendFile(path.resolve(filePath + 'asiData.csv')); // Resolve to an absolute path
            }
        } else {
            if (!asiDetails.length) {
                res.status(200).send({
                    data: asiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: asiDetails,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed....'});
    }
};





module.exports = {
    getIndicator,
    getStates,
    getNic,
    getASIData,
};