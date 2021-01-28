module.exports = (isDev) =>{
	
	return {
		preserveWhitepace:true,
		extractCss:!isDev,
		cssModules:{
			localIndexName:'[path]-[name]-[hash:base64:5]',
			camelCase:true
		},
		// hotReload:false
		 
	}
	
}