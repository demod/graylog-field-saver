// ==UserScript==
// @name         graylog field saver
// @version      0.1
// @description  Adds buttons to the graylog web interface to load and save field presets
// @author       J. Philippe Neumann <jean-philippe.neumann AT capgemini DOT com>
//
// @namespace    graylog_field_saver
// @match        http://graylog/streams/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/* 
License:
This work is licensed under a Creative Commons Attribution 4.0 International License.
http://creativecommons.org/licenses/by/4.0/

Please refer to https://github.com/demod/graylog-field-saver for instructions
*/

(function() {
    'use strict';

    /* constants */

    var LOCAL_STORAGE_FIELDS = "graylog_field_saver_fields";
    var LOCAL_STORAGE_AUTOLOAD = "graylog_field_saver_autoload";

    var ALL_FIELDS_LINK_REACTID = ".2.0.0.0.2.0.1.3";
    var CURRENT_PAGE_LINK_REACTID = ".2.0.0.0.2.0.1.1";
    var CHECKBOXES_REACTID_PREFIX = ".2.0.0.0.1.0";
    var FIELDS_HEADLINE_REACTID = ".2.0.0.0.0.4";

    /* functions */

    var clickAllFieldsLink = function() {
        document.querySelector('a[data-reactid="' + ALL_FIELDS_LINK_REACTID + '"]').click();
    };

    var clickCurrentPageLink = function() {
        document.querySelector('a[data-reactid="' + CURRENT_PAGE_LINK_REACTID + '"]').click();
    };

    var getFieldCheckboxes = function() {
        return document.querySelectorAll('input[type="checkbox"][data-reactid^="' + CHECKBOXES_REACTID_PREFIX + '"]');
    };

    var getAutoloadFlag = function() {
        var jsonAutoload = localStorage.getItem(LOCAL_STORAGE_AUTOLOAD) || "[]";
        var autoloadFlag = (JSON.parse(jsonAutoload) == true);

        return autoloadFlag;
    };

    /* callbacks */

    var loadBtnCallback = function() {
        clickAllFieldsLink();

        var boxes = getFieldCheckboxes();

        var jsonFields = localStorage.getItem(LOCAL_STORAGE_FIELDS) || "[]";
        var savedFields = JSON.parse(jsonFields);

        for (var i = 0; i < boxes.length; i++) {
            // check checkboxes of unchecked saved fields and uncheck checkboxes of checked unsaved fields
            if ((savedFields.indexOf(boxes[i].getAttribute("label")) > -1) != boxes[i].checked) {
                boxes[i].parentNode.click();
            }
        }

        clickCurrentPageLink();
    };

    var saveBtnCallback = function() {
        clickAllFieldsLink();

        var boxes = getFieldCheckboxes();
        var fieldsToSave = [];

        for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].checked) {
                fieldsToSave.push(boxes[i].getAttribute("label"));
            }
        }

        localStorage.setItem(LOCAL_STORAGE_FIELDS, JSON.stringify(fieldsToSave));

        clickCurrentPageLink();
    };

    var autoloadBtnCallback = function() {
        localStorage.setItem(LOCAL_STORAGE_AUTOLOAD, !getAutoloadFlag());
    };

    /* code */

    // insert load button
    var loadBtnHtml = '<button id="field_saver_loadBtn" type="button" class="btn btn-info btn-sm" style="margin:5px 5px 0 0">Load</button>';
    document.querySelector('h3[data-reactid="' + FIELDS_HEADLINE_REACTID + '"]')
        .insertAdjacentHTML("afterend", loadBtnHtml);
    var loadBtn = document.getElementById("field_saver_loadBtn");
    loadBtn.onclick = loadBtnCallback;

    // insert save button
    var saveBtnHtml = '<button id="field_saver_saveBtn" type="button" class="btn btn-danger btn-sm" style="margin:5px 5px 0 0">Save</button>';
    loadBtn.insertAdjacentHTML("afterend", saveBtnHtml);
    var saveBtn = document.getElementById("field_saver_saveBtn");
    saveBtn.onclick = saveBtnCallback;

    // insert auto load toggle button with correct toggle state
    if (getAutoloadFlag()) {
        var autoloadBtnHtml = `<button id="field_saver_autoloadBtn" type="button" class="btn btn-default btn-sm active" data-toggle="button" aria-pressed="true" autocomplete="off" style="margin:5px 5px 0 0">Auto load</button>`;
    } else {
        var autoloadBtnHtml = `<button id="field_saver_autoloadBtn" type="button" class="btn btn-default btn-sm" data-toggle="button" autocomplete="off" style="margin:5px 5px 0 0">Auto load</button>`;
    }

    saveBtn.insertAdjacentHTML("afterend", autoloadBtnHtml);
    var autoloadBtn = document.getElementById("field_saver_autoloadBtn");
    autoloadBtn.onclick = autoloadBtnCallback;

    // auto load saved fields (if enabled)
    if (getAutoloadFlag()) {
        loadBtnCallback();
    }
})();