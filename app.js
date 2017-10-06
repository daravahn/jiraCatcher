
var JiraClient = require('jira-connector');
var math = require('mathjs');
var program = require('commander');

program
  .version('0.1.0')
  .arguments('<domain> <auth> <begin> <end> <project> [type]')
  .action(function (domain, auth, begin, end, project, type) {
     domain = domain;
     auth = auth;
     begin = begin;
     end = end;
	 project = project;
     type = type;
  })
  .parse(process.argv);

var domain = program.args[0];
var auth = program.args[1];
var begin = program.args[2];
var end = program.args[3];
var project = program.args[4];
var type = program.args[5];

var jira = new JiraClient( {
    host: domain+'.atlassian.net',
    basic_auth: {
        base64: auth
    }
});

var jql = 'project="'+project+'" AND worklogDate >= '+begin+' AND worklogDate <= '+end

if(type != undefined) {
	jql = jql+' AND issuetype IN('+type+')';
}

jira.search.search({
    jql: jql,
    maxResults: 100,
    "fields": ["timespent"]    
}, function(error, result) {
	
	if(error == null && result != null) {

		console.log('Periodo: '+begin+' até '+end);
		console.log("Total issues: " +result.total);
		var total;
		result.issues.forEach(function(issue){
			total = math.sum(total, issue.fields.timespent);
		});

		console.log("Total horas: " +math.ceil(math.divide(total,3600)));
	} else {
		console.log(error);
	}
});

