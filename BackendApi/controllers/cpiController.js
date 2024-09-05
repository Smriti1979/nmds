//importing modules
const jwt = require("jsonwebtoken");
const db = require("../models");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const functionFromModule = require('../helper_utils/tokenVerifier.js');

const {
    getInflationCurrentRate2012,
    getInflationCurrentRateBackSeries2012,
    getAllIndiaItemInflationCombined2012,
    getAllMonths,getAllSector,getAllState,getAllItems,getAllGroups,getAllSubgroups } = require('../DbQuery/dbOperationsCPI.js');

const path = require('path');
require('dotenv').config();
const Sequelize = require('sequelize');


const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = process.env;
const User = db.users;

const getAllIndiaSiIndicesOrInflationData = async (req, res) => {


    try {
        var cpiDetails = [];
        var isUserValid = true;


        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }

        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }

        // var type = req.query.Indicator;
        var dataType = req.query.Series;

        if (dataType == 'Back_series') {
            cpiDetails = await getInflationCurrentRateBackSeries2012(req, isUserValid);


        } else {
            cpiDetails = await getInflationCurrentRate2012(req, isUserValid);

        }

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {

            if (!cpiDetails.length) {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'cpiData.csv'), // Resolve to an absolute path
                    header: Object.keys(cpiDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(cpiDetails);
                res.status(200).sendFile(path.resolve(filePath + 'cpiData.csv')); // Resolve to an absolute path

            }

        } else {
            if (!cpiDetails.length) {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};







const getAllIndiaItemIndicesOrInflationCombined = async (req, res) => {


    try {
        var cpiDetails = [];
        var isUserValid = true;

        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }

        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }


        cpiDetails = await getAllIndiaItemInflationCombined2012(req, isUserValid);

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {

            if (!cpiDetails.length) {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'cpiData.csv'), // Resolve to an absolute path
                    header: Object.keys(cpiDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(cpiDetails);

                res.status(200).sendFile(path.resolve(filePath + 'cpiData.csv')); // Resolve to an absolute path

            }

        } else {
            if (!cpiDetails.length) {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: cpiDetails,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};






const getMonths = async (req, res) => {
    try {
        var months = [];
        months = await getAllMonths();

        if (!months.length) {
            res.status(200).send({
                data: months,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: months,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getSector = async (req, res) => {
    try {
        var sector = [];
        sector = await getAllSector();

        if (!sector.length) {
            res.status(200).send({
                data: sector,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: sector,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getState = async (req, res) => {
    try {
        var state = [];
        state = await getAllState();

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




const getItems = async (req, res) => {
    try {
        var items = [];
        items = await getAllItems();

        if (!items.length) {
            res.status(200).send({
                data: items,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: items,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};



const getGroups = async (req, res) => {
    try {
        var groups = [];
        groups = await getAllGroups();

        if (!groups.length) {
            res.status(200).send({
                data: groups,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: groups,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};



const getSubgroups = async (req, res) => {
    try {
        var subgroups = [];
        subgroups = await getAllSubgroups();

        if (!subgroups.length) {
            res.status(200).send({
                data: subgroups,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: subgroups,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




module.exports = {
    getAllIndiaSiIndicesOrInflationData,
    getAllIndiaItemIndicesOrInflationCombined,
    getMonths,
    getSector,
    getState,
    getItems,
    getGroups,
    getSubgroups
};