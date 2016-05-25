#!/usr/bin/env node

var _ = require('underscore')
,	fs = require('fs')
,	Q = require('q')
,	args = require('yargs').argv
,	Uploader = require('ns-uploader')
,	targetFolder = args.targetFolder
,	localFolder = args.localFolder
,	CredentialsInquirer = require('credentials-inquirer')
,	inquirer = require('inquirer');

function Tool()
{

}

_.extend(Tool.prototype, {

	NS_DEPLOY_FILE: '.nsdeploy'

,	main: function()
	{		
		var self = this, t0, deferred = Q.defer(), credentials;

		this.getCredentials()
		.then(function(c)
		{
			credentials = c;
			t0 = new Date().getTime();
			return self.upload(c)
		})
		.then(function(nsDeploy)
		{
			var took = new Date().getTime() - t0;
			console.log('\nUpload complete in ' +  ( (took/1000/60) + '').substring(0,4) + ' minutes !');
			self.saveCredentials(credentials);
			deferred.resolve(nsDeploy, took);
		})
		.catch(function(err)
		{
			console.log('Deploy error: ', err, err.stack); 
			deferred.reject(err); 
		});
		return deferred.promise;
	}

,	saveCredentials: function(data)
	{
		var credentials = _.clone(data)
		delete credentials.password;
		fs.writeFileSync(this.NS_DEPLOY_FILE, JSON.stringify(credentials, null, 4));
	}

,	getCredentials: function()
	{
		var deferred =  Q.defer(), nsDeploy, file_found = false;

		nsDeploy = this._parseJsonFile(this.NS_DEPLOY_FILE)
		if(!nsDeploy)
		{
			nsDeploy = this._parseJsonFile(args.nsdeploy)
			if(nsDeploy)
			{
				file_found = true;
			}
		}
		else
		{
			file_found = true;
		}

		if(file_found)
		{
			if(!nsDeploy.password)
			{
				// we might need to ask the password as is not stored in fs
				inquirer.prompt([{
					type: 'password'
				,	name: 'password'
				,	message: 'Password'
				}], function(answers) 
				{
					nsDeploy.password = answers.password; 
					deferred.resolve(nsDeploy); 
				});
			}
			else
			{				
				deferred.resolve(nsDeploy); 
			}			
		}
		else
		{
			var credentialsInquirer = new CredentialsInquirer();
			credentialsInquirer.credentials.vm = args.vm;
			credentialsInquirer.credentials.molecule = args.molecule;
			
			credentialsInquirer.main()
			.then(function()
			{
				var credentials = credentialsInquirer.credentials
				,	jsUploaderCredentials = credentialsInquirer.getAsNsUploader(credentials); 
				deferred.resolve(jsUploaderCredentials); 	
			})
			.catch(function(err)
			{
				deferred.reject(err); 
				console.log('Error obtaining credentials: ', err, err.stack); 
			});
		}
		return deferred.promise;
	}

,	upload: function(credentials)
	{
		var deferred =  Q.defer();

		var uploader = new Uploader(credentials); 
		uploader.addProgressListener(_.bind(this.progressListener, this));		

		var localFolder = args.inputFolder || '.';
		var config = {
			targetFolderId: credentials.target_folder
		,	sourceFolderPath: localFolder
		}; 

		var t0 = new Date().getTime();

		uploader
			.main(config)
			.then(function (children)
			{
				var took = (new Date().getTime() - t0) / 1000;
				deferred.resolve(children, took);
			})
			.catch(function(err)
			{				
				deferred.reject(err);
			});

		return deferred.promise; 
	}

,	bottomBar: new inquirer.ui.BottomBar()

,	progressListener: function(actual, total)
	{
		this.bottomBar.updateBottomBar('Progress: ' + Math.round(actual/total * 100) + ' %');	
	}

,	_parseJsonFile: function(f)
	{
		try 
		{
			if(!f)
			{
				return;
			}
			var r = fs.readFileSync(f).toString()
			return r ? JSON.parse(r) : undefined
		}
		catch(ex)
		{
			//file doesn't exists
		}
	}

});


//main
var tool = new Tool(); 
tool.main();




