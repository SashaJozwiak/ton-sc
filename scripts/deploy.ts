//import { beginCell, storeStateInit } from "@ton/core";
import { hex } from "../build/main.compiled.json";
//import { Cell, contractAddress, StateInit, toNano } from "ton";

import {
    beginCell,
    Cell,
    contractAddress,
    StateInit,
    storeStateInit,
    toNano,
} from "@ton/core";

//import qs from 'qs';
//import qrcode from "qrcode-terminal";

var qs = require('qs');
var qrcode = require('qrcode-terminal');
var dotenv = require('dotenv');

dotenv.config();

async function deployScript() {

    console.log(
        "================================================================="
    );
    console.log("Deploy script is running, let's deploy our main.fc contract...");

    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell = new Cell();

    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell,
    };

    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    const address = contractAddress(0, {
        code: codeCell,
        data: dataCell,
    });

    console.log(
        `The address of the contract is following: ${address.toString()}`
    );
    console.log(`Please scan the QR code below to deploy the contract:`);

    let link =
        `ton://transfer/` +
        address.toString({
            testOnly: true,
        }) + "?" +
        qs.stringify({
            text: "Deploy contract",
            amount: toNano('0.01').toString(10),
            init: stateInitCell.toBoc({ idx: false }).toString("base64"),
        });

    //console.log(link)

    qrcode.generate(link, { small: true }, (code) => {
        console.log(code);
    });

}

deployScript();
