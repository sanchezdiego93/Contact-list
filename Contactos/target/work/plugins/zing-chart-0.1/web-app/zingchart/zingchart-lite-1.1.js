zingchart = {

	oData : {},

	oDefaults : {},
	
	oIds : {},

	alert : function(sValue) {
		alert(sValue);
	},

	jsdatafunc : function(sJson) {
		var oResponse = eval('(' + sJson + ')');
		var sId = oResponse['id'] || '';
		return zingchart.oData[sId];
	},

	jsdefaultsfunc : function(sJson) {
		var oResponse = eval('(' + sJson + ')');
		var sId = oResponse['id'] || '';
		return zingchart.oDefaults[sId];
	},

	setData : function(sId, sData) {
		zingchart.oData[sId] = sData;
	},

	getData : function(sId) {
		return zingchart.oData[sId] || '';
	},
	
	exec: function(sId, sFunction, sData){
	    var sFlashId = zingchart.oIds[sId];
	    return document.getElementById(sFlashId).zcExec(sFunction, sData);
	},

	render : function(oOptions) {
		oOptions = oOptions || {};
		
		var sId = oOptions['container'] || ('zingchart' + parseInt(9999*Math.random(), 10));
		var bPreserveContainer = oOptions['preservecontainer'] || false;
		var sWidth = oOptions['width'] || 480;
		var sHeight = oOptions['height'] || 320;
		var sBgColor = oOptions['bgcolor'] || '0xffffff';
		if (sWidth == 'auto') {
			sWidth = '100%';
		}
		if (sHeight == 'auto') {
			sHeight = '100%';
		}
		var sLibUrl = oOptions['liburl'] || 'zingchart.swf';
		var sDataUrl = oOptions['dataurl'] || '';
		var sDefaultsUrl = oOptions['defaultsurl'] || '';
		var sJsDataFunc = oOptions['jsdatafunc'] || '';
		var sJsDefaultsFunc = oOptions['jsdefaultsfunc'] || '';
		var oFlashVars = oOptions['flashvars'] || {};
		var sDefaults = oOptions['defaults'] || '';
		var sData = oOptions['data'] || '{"graphset":[]}';
		sData = (sData.replace(/(\s)/,'')=='')?'{}':sData;

		oFlashVars['url'] = escape(sDataUrl);
		oFlashVars['jsobjectid'] = escape(sId);
		oFlashVars['bgcolor'] = escape(sBgColor);

		if (sDefaultsUrl != '') {
			oFlashVars['defaultsurl'] = escape(sDefaultsUrl);
		}
		if (sData != '{"graphset":[]}') {
			oFlashVars['jsdatafunc'] = 'zingchart.jsdatafunc';
			zingchart.oData[sId] = sData;
		}
		if (sJsDataFunc != '') {
			oFlashVars['jsdatafunc'] = sJsDataFunc;
		}
		if (sDefaults != '') {
			oFlashVars['jsdefaultsfunc'] = 'zingchart.jsdefaultsfunc';
			zingchart.oDefaults[sId] = sDefaults;
		}
		if (sJsDefaultsFunc != '') {
			oFlashVars['jsdefaultsfunc'] = sJsDefaultsFunc;
		}

		oFlashVars['baseurl'] = escape(window.location.href);

		var sFlashId;
		if (bPreserveContainer){
		    var div = document.createElement('div');
		    div.style.width = "100%";
		    div.style.height = "100%";
		    sFlashId = div.id = sId + "zingchart_holder";
            
		    var obj = document.getElementById(sId);
		    if (obj.hasChildNodes()){
                while (obj.childNodes.length > 0){
                    obj.removeChild(obj.firstChild);       
                } 
            }
		    obj.appendChild(div);
		}
		else{
		    sFlashId = sId;
		}
		
		zingchart.oIds[sId] = sFlashId;
		
		var oParameters = {
			'allowScriptAccess' : 'always',
			'allowFullScreen' : 'true',
			'id' : sId,
			'name' : sId,
			'movie' : 'zingchart.swf',
			'wmode' : 'transparent'
		};
		var oAttributes = {};
		swfobject.embedSWF(
			sLibUrl,
			sFlashId,
			sWidth,
			sHeight,
			'9.0.0',
			'',
			oFlashVars,
			oParameters,
			oAttributes
		);
	}

}
