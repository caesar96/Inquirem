(function () {
    'use strict';

	/*  UTILITIES VARS */
	var fs = require('fs');
    var cache = {};
    var quoteSingleRexExp = new RegExp('\'', 'g');
    var quoteDoubleRexExp = new RegExp('"', 'g');

	/* UTILITIES FUNCTIONS */
    function isArray(arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }
    function isObject(obj) {
        return obj instanceof Object;
    }
    function isFunction(func) {
        return typeof func === 'function';
    }
    function _escape(string) {
        return string
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');
    }
    function helperToSlices(string) {
        var helperParts = string.replace(/[{}#}]/g, '').split(' ');
        var slices = [];
        var shiftIndex, i, j;
        for (i = 0; i < helperParts.length; i++) {
            var part = helperParts[i];
            var blockQuoteRegExp, openingQuote;
            if (i === 0) slices.push(part);
            else {
                if (part.indexOf('"') === 0 || part.indexOf('\'') === 0) {
                    blockQuoteRegExp = part.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
                    openingQuote = part.indexOf('"') === 0 ? '"' : '\'';
                    // Plain String
                    if (part.match(blockQuoteRegExp).length === 2) {
                        // One word string
                        slices.push(part);
                    }
                    else {
                        // Find closed Index
                        shiftIndex = 0;
                        for (j = i + 1; j < helperParts.length; j++) {
                            part += ' ' + helperParts[j];
                            if (helperParts[j].indexOf(openingQuote) >= 0) {
                                shiftIndex = j;
                                slices.push(part);
                                break;
                            }
                        }
                        if (shiftIndex) i = shiftIndex;
                    }
                }
                else {
                    if (part.indexOf('=') > 0) {
                        // Hash
                        var hashParts = part.split('=');
                        var hashName = hashParts[0];
                        var hashContent = hashParts[1];
                        if (!blockQuoteRegExp) {
                            blockQuoteRegExp = hashContent.indexOf('"') === 0 ? quoteDoubleRexExp : quoteSingleRexExp;
                            openingQuote = hashContent.indexOf('"') === 0 ? '"' : '\'';
                        }
                        if (hashContent.match(blockQuoteRegExp).length !== 2) {
                            shiftIndex = 0;
                            for (j = i + 1; j < helperParts.length; j++) {
                                hashContent += ' ' + helperParts[j];
                                if (helperParts[j].indexOf(openingQuote) >= 0) {
                                    shiftIndex = j;
                                    break;
                                }
                            }
                            if (shiftIndex) i = shiftIndex;
                        }
                        var hash = [hashName, hashContent.replace(blockQuoteRegExp,'')];
                        slices.push(hash);
                    }
                    else {
                        // Plain variable
                        slices.push(part);
                    }
                }
            }
        }
        return slices;
    }
    function stringToBlocks(string) {
        var blocks = [], i, j, k;
        if (!string) return [];
        var _blocks = string.split(/({{[^{^}]*}})/);
        for (i = 0; i < _blocks.length; i++) {
            var block = _blocks[i];
            if (block === '') continue;
            if (block.indexOf('{{') < 0) {
                blocks.push({
                    type: 'plain',
                    content: block
                });
            }
            else {
                if (block.indexOf('{/') >= 0) {
                    continue;
                }
                if (block.indexOf('{#') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
                    // Simple variable
                    blocks.push({
                        type: 'variable',
                        contextName: block.replace(/[{}]/g, '')
                    });
                    continue;
                }
                // Helpers
                var helperSlices = helperToSlices(block);
                var helperName = helperSlices[0];
                var isPartial = helperName === '>';
                var helperContext = [];
                var helperHash = {};
                for (j = 1; j < helperSlices.length; j++) {
                    var slice = helperSlices[j];
                    if (isArray(slice)) {
                        // Hash
                        helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
                    }
                    else {
                        helperContext.push(slice);
                    }
                }

                if (block.indexOf('{#') >= 0) {
                    // Condition/Helper
                    var helperStartIndex = i;
                    var helperContent = '';
                    var elseContent = '';
                    var toSkip = 0;
                    var shiftIndex;
                    var foundClosed = false, foundElse = false, foundClosedElse = false, depth = 0;
                    for (j = i + 1; j < _blocks.length; j++) {
                        if (_blocks[j].indexOf('{{#') >= 0) {
                            depth ++;
                        }
                        if (_blocks[j].indexOf('{{/') >= 0) {
                            depth --;
                        }
                        if (_blocks[j].indexOf('{{#' + helperName) >= 0) {
                            helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                            toSkip ++;
                        }
                        else if (_blocks[j].indexOf('{{/' + helperName) >= 0) {
                            if (toSkip > 0) {
                                toSkip--;
                                helperContent += _blocks[j];
                                if (foundElse) elseContent += _blocks[j];
                            }
                            else {
                                shiftIndex = j;
                                foundClosed = true;
                                break;
                            }
                        }
                        else if (_blocks[j].indexOf('else') >= 0 && depth === 0) {
                            foundElse = true;
                        }
                        else {
                            if (!foundElse) helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                        }

                    }
                    if (foundClosed) {
                        if (shiftIndex) i = shiftIndex;
                        blocks.push({
                            type: 'helper',
                            helperName: helperName,
                            contextName: helperContext,
                            content: helperContent,
                            inverseContent: elseContent,
                            hash: helperHash
                        });
                    }
                }
                else if (block.indexOf(' ') > 0) {
                    if (isPartial) {
                        helperName = '_partial';
                        if (helperContext[0]) helperContext[0] = '"' + helperContext[0].replace(/"|'/g, '') + '"';
                    }
                    blocks.push({
                        type: 'helper',
                        helperName: helperName,
                        contextName: helperContext,
                        hash: helperHash
                    });
                }
            }
        }
        return blocks;
    }
	function getHTML(path) {
		var content = fs.readFileSync(path);
		if (!content) return 'Error loading template...';
		return content.toString().replace(/[\r\n\t]+/g, '').replace(/\s+/gm, " ");
	}
	function getHTML_List(path) {
		return fs.readdirSync(path);
	}
	function compileTemplate (template, options) {
			var instance = new JTML(template, options);
			return instance.compile();
	}

	/* JTML OBJECT */
	var JTML = function (template, options) {
        var t = this;
        t.template = template;
		t.templateName = options.templateName || '';

        function getCompileFn(block, depth) {
            if (block.content) return compile(block.content, depth);
            else return function () {return ''; };
        }
        function getCompileInverse(block, depth) {
            if (block.inverseContent) return compile(block.inverseContent, depth);
            else return function () {return ''; };
        }
        function getCompileVar(name, ctx) {
            var variable, parts, levelsUp = 0, initialCtx = ctx;
            if (name.indexOf('../') === 0) {
                levelsUp = name.split('../').length - 1;
                var newDepth = ctx.split('_')[1] - levelsUp;
                ctx = 'ctx_' + (newDepth >= 1 ? newDepth : 1);
                parts = name.split('../')[levelsUp].split('.');
            }
            else if (name.indexOf('@global') === 0) {
                ctx = 'self.global';
                parts = name.split('@global.')[1].split('.');
            }
            else if (name.indexOf('@root') === 0) {
                ctx = 'root';
                parts = name.split('@root.')[1].split('.');
            }
            else {
                parts = name.split('.');
            }
            variable = ctx;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part.indexOf('@') === 0) {
                    if (i > 0) {
                        variable += '[(data && data.' + part.replace('@', '') + ')]';
                    }
                    else {
                        variable = '(data && data.' + name.replace('@', '') + ')';
                    }
                }
                else {
                    if (isFinite(part)) {
                        variable += '[' + part + ']';
                    }
                    else {
                        if (part === 'this' || part.indexOf('this.') >= 0 || part.indexOf('this[') >= 0 || part.indexOf('this(') >= 0) {
                            variable = part.replace('this', ctx);
                        }
                        else {
                            variable += '.' + part;
                        }
                    }
                }
            }

            return variable;
        }
        function getCompiledArguments(contextArray, ctx) {
            var arr = [];
            for (var i = 0; i < contextArray.length; i++) {
                if (/^['"]/.test(contextArray[i])) arr.push(contextArray[i]);
                else if (/^(true|false|\d+)$/.test(contextArray[i])) arr.push(contextArray[i]);
                else {
                    arr.push(getCompileVar(contextArray[i], ctx));
                }
            }

            return arr.join(', ');
        }
        function compile(template, depth) {
            depth = depth || 1;
            template = template || t.template;
            if (typeof template !== 'string') {
                throw new Error('JTML: Template must be a string');
            }
            var blocks = stringToBlocks(template);
			//console.log(blocks);
			//require('fs').writeFileSync('/mnt/c/nodeJS/askme.fm/logs/blocks.js', JSON.stringify(blocks));
            if (blocks.length === 0) {
                return function () { return ''; };
            }
            var ctx = 'ctx_' + depth;
            var resultString = '';
			//console.log(t.templateName);console.log("\n-----"+ctx+"-----\n");
            if (depth === 1) {
                resultString += '(function (' + ctx + ', data, root) { ctx_1 = ctx_1 || {};var self = this; //console.log(ctx_1);console.log("\\n----------");\n';
            }
            else {
                resultString += '(function (' + ctx + ', data) {\n';
            }
            if (depth === 1) {
				//resultString += 'calledFrom = ' + calledFrom.toString() + '\n\n';
                resultString += 'function isArray(arr){return Object.prototype.toString.apply(arr) === \'[object Array]\';}\n';
                resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
                resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
                if (t.templateName.length > 0)
					resultString += 'ctx_1.page = \'' + t.templateName + '\';';
				resultString += '\nroot = root || ctx_1 || {};\n';
            }
            resultString += 'var r = \'\';\n';
            var i, j, context, lastHelper = '';
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                // Plain block
                if (block.type === 'plain') {
                    resultString += 'r +=\'' + (block.content).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'') + '\';';
                    continue;
                }
                var variable, compiledArguments;
                // Variable block
                if (block.type === 'variable') {
                    variable = getCompileVar(block.contextName, ctx);
                    resultString += 'r += c(' + variable + ', ' + ctx + ');';
                }
                // Helpers block
                if (block.type === 'helper') {

                    if (block.helperName in t.helpers) {
                        compiledArguments = getCompiledArguments(block.contextName, ctx);
                        resultString += 'r += (self.helpers.' + block.helperName + ').call(' + ctx + ', ' + (compiledArguments && (compiledArguments + ', ')) +'{hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth + 1) + ', inverse: ' + getCompileInverse(block, depth + 1) + ', root: root});';
					}
                    else {
                        if (block.contextName.length > 0) {
                            throw new Error('JTML: Missing helper: "' + block.helperName + '"');
                        }
                        else {
                            variable = getCompileVar(block.helperName, ctx);
                            resultString += 'if (' + variable + ') {';
                            resultString += 'if (isArray(' + variable + ')) {';
                            resultString += 'r += (self.helpers.each).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: root});';
							resultString += '}else {';
                            resultString += 'r += (self.helpers.with).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth+1) + ', inverse: ' + getCompileInverse(block, depth+1) + ', root: root});';
							resultString += '}}';
                        }
                    }
                }
            }
			resultString += '\nreturn r; })';
            //resultString += '\nreturn r.replace(\/[\\n|\\r\\n|\\t]\/g, "").replace(\/\\s+\/gm, " "); })';
			//require('fs').writeFileSync('/mnt/c/nodeJS/askme.fm/logs/file'+depth+'.js', resultString);
			//console.log(resultString);
            return eval(resultString);
        }
        t.compile = function (template) {
            if (!t.compiled) {
                t.compiled = compile(template);
            }
            return t.compiled;
        };
    };
    JTML.prototype = {
        options: {},
        partials: {},
        helpers: {
            '_partial' : function (partialName, options) {
                var p = JTML.prototype.partials[partialName];
                if (!p || (p && !p.template)) return '';
                if (!p.compiled && !isFunction(p.template)) {
                    p.compiled = new JTML(p.template, {templateName: this.page}).compile();
                }
				if (isFunction(p.template))
					p.compiled = new JTML(p.template(), {templateName: this.page}).compile();

                var ctx = this;
                for (var hashName in options.hash) {
                    ctx[hashName] = options.hash[hashName];
                }
                return p.compiled.call(JTML.prototype, ctx, options.data, options.root);
            },
            'escape': function (context, options) {
                if (typeof context !== 'string') {
                    throw new Error('JTML: Passed context to "escape" helper should be a string');
                }
                return _escape(context);
            },
            'if': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                if (context) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);
                }
            },
            'unless': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                if (!context) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);
                }
            },
            'each': function (context, options) {
                var ret = '', i = 0;
                if (isFunction(context)) { context = context.call(this); }
                if (isArray(context)) {
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                    for (i = 0; i < context.length; i++) {
                        ret += options.fn(context[i], {first: i === 0, last: i === context.length - 1, index: i});
                    }
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                }
                else {
                    for (var key in context) {
                        i++;
                        ret += options.fn(context[key], {key: key});
                    }
                }
                if (i > 0) return ret;
                else return options.inverse(this);
            },
            'with': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                return options.fn(context);
            },
            'join': function (context, options) {
                if (isFunction(context)) { context = context.call(this); }
                return context.join(options.hash.delimiter || options.hash.delimeter);
            },
            'js': function (expression, options) {
                var func;
                if (expression.indexOf('return')>=0) {
                    func = '(function(){'+expression+'})';
                }
                else {
                    func = '(function(){return ('+expression+')})';
                }
                return eval.call(this, func).call(this);
            },
            'js_compare': function (expression, options) {
                //console.log(expression);
                //console.log(options);
                var func;
                if (expression.indexOf('return')>=0) {
                    func = '(function(){'+expression+'})';
                }
                else {
                    func = '(function(){return ('+expression+')})';
                }
                var condition = eval.call(this, func).call(this);
                if (condition) {
                    return options.fn(this, options.data);
                }
                else {
                    return options.inverse(this, options.data);
                }
            },
            'for': function (expression, options) {
                if (typeof expression != "string" || expression.length <= 0) throw new Error("First parameter must be a string");
                if (typeof options.hash.action != "string" || options.hash.action <= 0) throw new Error("Second parameter must be a string and have a conditional for For Loop");
                var out = '';
                out = eval('(function () {var outer = \'\';for (var '+options.hash.action+') {outer += this.fn({'+expression+': '+expression+'}, this.data);};return outer;})');
                return out.call(options);
            }
        }
    };


	/* MAIN APP */
	var app = function (_options_) {
		this.html_dir = _options_.html_dir || '';
		this.cache = _options_.cache || false;
		this.out = {};
    };

	app.prototype.createTemplates = function () {
		var _self_ = this;
		var fileList = getHTML_List(_self_.html_dir);
		var name = '';
		var shortName = '';
		//
		for (var i = 0; i < fileList.length; ++i) {
			//
			name = fileList[i];
			//
			if (/(^p\.)/g.test(name)) continue;
			//
			shortName = name.replace(/(\.\w+$)/gi, "");
			//

			//
			_self_.out[ shortName ] = (_self_.cache) ? compileTemplate(getHTML(_self_.html_dir + '/' + name), {templateName: shortName}) :  eval('(function (_obj_){\n'+
				'//console.log(this);\n'+
				'\treturn compileTemplate( getHTML("' + _self_.html_dir + '/' + name + '" ), {templateName: "' + shortName + '"}).call(this, _obj_);\n'+
			'})');
			//console.log(_self_.out[ shortName ].toString());
		}
		//
		_self_.out.registerHelper = function (name, fn) {
			JTML.prototype.helpers[name] = fn;
		};
		_self_.out.unregisterHelper = function (name) {
			JTML.prototype.helpers[name] = undefined;
			delete JTML.prototype.helpers[name];
		};
		_self_.out.registerPartial = function (name, template) {
			JTML.prototype.partials[name] = {template: template};
		};
		_self_.out.unregisterPartial = function (name, template) {
			if (JTML.prototype.partials[name]) {
				JTML.prototype.partials[name] = undefined;
				delete JTML.prototype.partials[name];
			}
		};
		_self_.out.options = JTML.prototype.options;
		_self_.out.helpers = JTML.prototype.helpers;
		_self_.out.partials = JTML.prototype.partials;
		JTML.prototype.filePath = _self_.html_dir;
		//
		for (var i = 0; i < fileList.length; ++i) {
			//
			name = fileList[i];
			//
			if (!/(^p\.)/g.test(name)) continue;
			//
			shortName = name.replace(/(\.\w+$)/gi, "").replace(/(^p\.)/g, '');
			//
			if (_self_.cache)
				_self_.out.registerPartial(shortName, getHTML(_self_.html_dir + '/' + name));
			else {
				_self_.out.registerPartial(shortName, eval('(function (){\n' +
					'return getHTML("' + _self_.html_dir + '/' + name + '");' +
				'})'));
			}
		}
		//
		_self_.out.global = {};
		JTML.prototype.global = _self_.out.global;
		return _self_.out;
	}

	// Exporting definition of 'app()'
	module.exports = function (o) {
		return new app(o).createTemplates();
	}
})();