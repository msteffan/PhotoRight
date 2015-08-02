<?php

/*
 *  Flickr License 
 */

function getLicenseInfo($licenseID){
	$licenseArray = array(
		0 => 'All Rights Reserved',
		1 => 'Attribution-NonCommercial-ShareAlike License',
		2 => 'Attribution-NonCommercial License',
		3 => 'Attribution-NonCommercial-NoDerivs License',
		4 => 'Attribution License',
		5 => 'Attribution-ShareAlike License',
		6 => 'Attribution-NoDerivs License',
		7 => 'No known copyright restrictions',
		8 => 'United States Government Work',
		9 => 'Public Domain Dedication (CC0)',
		10 => 'Public Domain Mark',
		);
	if(array_key_exists($licenseID, $licenseArray))
		return $licenseArray[$licenseID];
	else
		return null;
}

?>