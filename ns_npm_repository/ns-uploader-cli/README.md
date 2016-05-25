This is a command line tool for uploading local folders to netsuite's filecabinet. 

It uses ns-uploader to offer a command line api to upload a folder contents to netsuite. It also has the responsibility of storing/reading from .nsdeploy files. 

#Install

    cd ns-uploader-cli
    sudo npm link

#Usage

    ns-uploader

Alone it uploads current folder. If there is a .nsdeploy file it will use it and ask for only the password. Otherwise it will ask all the data. 

Optionally local folder path and a target .nsdeploy config file can be passed:

    ns-uploader --input-folder=workspace1/project1 --nsdeploy=mydeploys/checkout_opc_skiplogin.nsdeploy

#Netsuite molecules, datacenters and scrum VMs

If you want to go against a netsuite account located in a certain molecule or datacenter, please pass this information using the --molecule parameter. For example, if I want to deploy to an account that uses an url like https://system.na1.sandbox.netsuite.com, then the command would be:

	ns-uploader --molecule na1.sandbox

If you want to go against a netsuite scrum VM which url is http://sgurin.se4.eng.netsuite.com/ then use the command 

	ns-uploader --vm http://sgurin.se4.eng.netsuite.com/

*IMPORTANT* for VMs only use http - https won't work!

#TODO

 * be able to ignore folder / files from being uploaded (in the .nsdeploy info)
 * black list of files, for example, .nsdeploy files is uploaded the second time :(