//importing modules
const db = require("../models");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const functionFromModule = require('../helper_utils/tokenVerifier.js');

const { getAllMonthRepo,getAllFrequencyRepo,getAllCategoryRepo,getAllSubcategoryRepo,getAllIndexandGrowthRateAnnualRepo,getAllIndexandGrowthRateMonthlyRepo } = require('../DbQuery/dbOperationIIP.js');





const path = require('path');
require('dotenv').config();
const Sequelize = require('sequelize');





const getMonth = async (req, res) => {
    try {
        var months = [];
        months = await getAllMonthRepo();

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




const getFrequency = async (req, res) => {
    try {
        var frequency = [];
        frequency = await getAllFrequencyRepo();

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




const getCategory = async (req, res) => {
    try {
        var category = [];
        category = await getAllCategoryRepo();

        if (!category.length) {
            res.status(200).send({
                data: category,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: category,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};




const getSubcategory = async (req, res) => {
    try {
        var subcategory = [];
        subcategory = await getAllSubcategoryRepo();

        if (!subcategory.length) {
            res.status(200).send({
                data: subcategory,
                msg: "No Data Found",
                statusCode: true
            });
        } else {
             res.status(200).send({
                data: subcategory,
                msg: "Data fetched successfully",
                statusCode: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed' });
    }
};







const getIIPAnnual = async (req, res) => {

    try {
        var isUserValid = true;
        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }
        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }

        var  iipDetails = await getAllIndexandGrowthRateAnnualRepo(req, isUserValid);

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {
            if (!iipDetails.length) {
                res.status(200).send({
                    data: iipDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'iipData.csv'), // Resolve to an absolute path
                    header: Object.keys(iipDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(iipDetails);
                res.status(200).sendFile(path.resolve(filePath + 'iipData.csv')); // Resolve to an absolute path
            }
        } else {
            if (!iipDetails.length) {
                res.status(200).send({
                    data: iipDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: iipDetails,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed'});
    }
};



const getIIPMonthly = async (req, res) => {

    try {
        var isUserValid = true;
        if (req.headers['authorization'] == null) {
            isUserValid = false;
        }
        const data = functionFromModule.verifyToken(req.headers['authorization']);
        if (data == undefined) {
            isUserValid = false;
        }

        var  iipDetails = await getAllIndexandGrowthRateMonthlyRepo(req, isUserValid);

        if (req.query.Format && req.query.Format.toLowerCase() === 'csv') {
            if (!iipDetails.length) {
                res.status(200).send({
                    data: iipDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                const filePath = process.cwd() + "/logs/";
                const csvWriter = createCsvWriter({
                    path: path.resolve(filePath + 'iipData.csv'), // Resolve to an absolute path
                    header: Object.keys(iipDetails[0]).map(key => ({ id: key, title: key })),
                });
                await csvWriter.writeRecords(iipDetails);
                res.status(200).sendFile(path.resolve(filePath + 'iipData.csv')); // Resolve to an absolute path
            }
        } else {
            if (!iipDetails.length) {
                res.status(200).send({
                    data: iipDetails,
                    msg: "No Data Found",
                    statusCode: true
                });
            } else {
                res.status(200).send({
                    data: iipDetails,
                    msg: "Data fetched successfully",
                    statusCode: true
                });
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Please check the input parameters passed'});
    }
};



module.exports = {
    getMonth,
    getFrequency,
    getCategory,
    getSubcategory,
    getIIPAnnual,
    getIIPMonthly,
};