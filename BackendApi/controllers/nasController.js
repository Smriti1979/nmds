//importing modules
const db = require("../models/index.js");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const functionFromModule = require('../helper_utils/tokenVerifier.js');

const {getIndicatorsRepo, getApproachRepo, getRevisionRepo, getAccountRepo, getFrequencyRepo, getQuarterlyRepo, getInstitutionalRepo, getIndustryRepo, getSubindustryRepo, getNASRecordsRepo } = require('../DbQuery/dbOperationNAS.js');



const path = require('path');
require('dotenv').config();
const Sequelize = require('sequelize');





const getIndicators = async (req, res) => {
    try {
        var indicator = [];
        indicator = await getIndicatorsRepo();

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




const getApproach = async (req, res) => {
    try {
        var approach = [];
        approach = await getApproachRepo();

        if (!approach.length) {
            res.status(200).send({
                data: approach,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: approach,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getRevision = async (req, res) => {
    try {
        var revision = [];
        revision = await getRevisionRepo();

        if (!revision.length) {
            res.status(200).send({
                data: revision,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: revision,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};





const getAccount = async (req, res) => {
    try {
        var account = [];
        account = await getAccountRepo();

        if (!account.length) {
            res.status(200).send({
                data: account,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: account,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getFreq = async (req, res) => {
    try {
        var frequency = [];
        frequency = await getFrequencyRepo();

        if (!frequency.length) {
            res.status(200).send({
                data: frequency,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: frequency,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};






const getQuarterly = async (req, res) => {
    try {
        var quarterly = [];
        quarterly = await getQuarterlyRepo();

        if (!quarterly.length) {
            res.status(200).send({
                data: quarterly,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: quarterly,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getInstitutional = async (req, res) => {
    try {
        var institutional = [];
        institutional = await getInstitutionalRepo();

        if (!institutional.length) {
            res.status(200).send({
                data: institutional,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: institutional,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};





const getIndustry = async (req, res) => {
    try {
        var industry = [];
        industry = await getIndustryRepo();

        if (!industry.length) {
            res.status(200).send({
                data: industry,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: industry,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};






const getSubindustry = async (req, res) => {
    try {
        var subindustry = [];
        subindustry = await getSubindustryRepo();

        if (!subindustry.length) {
            res.status(200).send({
                data: subindustry,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: subindustry,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};








const getNASData = async (req, res) => {

    try {
        var isUserValid = true;
        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }
        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }

        var  nasDetails = await getNASRecordsRepo(req, isUserValid);
        // console.log("final_query", nasDetails)
        

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {
            if (!nasDetails.length) {
                res.status(200).send({
                    data: nasDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'nasData.csv'), // Resolve to an absolute path
                    header: Object.keys(nasDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(nasDetails);
                res.status(200).sendFile(path.resolve(filePath + 'nasData.csv')); // Resolve to an absolute path
            }
        } else {
            if (!nasDetails.length) {
                res.status(200).send({
                    data: nasDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: nasDetails,
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
    getIndicators,
    getApproach,
    getRevision,
    getAccount,
    getFreq,
    getQuarterly,
    getInstitutional,
    getIndustry,
    getSubindustry,
    getNASData,
};