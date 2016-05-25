var child_process = require('child_process');
module.exports = function(cmd, args, callback)
{
	var child = child_process.spawn(cmd, args, {
		stdio: [
			0, // use parents stdin for child
			1, // use parent's stdout stream - IMPORTANT if we dont do this things like the spinner will break the automation.
			2  // fs.openSync('err.out', 'w') // direct child's stderr to a file
		]
	});
	child.on('close', function()
	{
		callback.apply(null, arguments); 
	});
	return child;
};