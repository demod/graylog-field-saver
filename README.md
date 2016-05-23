# graylog-field-saver
A greasemonkey script that adds buttons to the graylog web interface to load and save field presets.

## License
This work is licensed under a Creative Commons Attribution 4.0 International License.
http://creativecommons.org/licenses/by/4.0/

## Disclaimer
This script has been tested with graylog-web-interface 1.3.3, chrome 50.0 and firefox 46.0.1.

## Instructions
1. Make the script apply to your graylog instance either by
  * entering the ip of your graylog instance into your /etc/hosts with the hostname "graylog"
  * or by modifying the @match field in the "==UserScript==" header of the script
2. Install the script in your browser
  * chrome: go to "Menu -> Settings -> Extensions" and drag&drop the .js file into the dialog
  * firefox: install the extension "greasemonkey", restart firefox and drag&drop the .js file
    into a browser window
3. Open your graylog instance using the URL configured in the @match field in the 
    "==UserScript==" header of the script
