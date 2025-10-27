// login ekranı user create update list delete işlemleri.
// Datatable kullan ajax ile verileri işle post et.
// jquery modern confirm kullan. select2 vs. bunlarda olsun.

import "./style.css";
import $ from 'jquery';
import 'jquery-confirm/dist/jquery-confirm.min.css';
import 'jquery-confirm/dist/jquery-confirm.min.js';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "select2";
import "jquery-confirm";
import axios from "axios";

$.confirm({
    title: 'What is up?',
    content: 'Here goes a little content',
    type: 'green',
    buttons: {   
        ok: {
            text: "ok!",
            btnClass: 'btn-primary',
            keys: ['enter'],
            action: function(){
                 console.log('the user clicked confirm');
            }
        },
        cancel: function(){
                console.log('the user clicked cancel');
        }
    }
});

$(document).ready(function () {
	$(".js-example-basic-single").select2();
});

axios.defaults.baseURL = "http://localhost:3000";

axios.get().then(function (response) {
	console.log(response);
});