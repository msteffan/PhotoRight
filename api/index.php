<?php
require_once('auth.php');
/*
 * API Stuff
 *
*/

//set some return variables
$statusCode = 200;
$error_message = '';
$licenseInfo = '';
$owner = '';

//detect domain
$parsedomain = parse_url($_GET['url']);
$domain = $parsedomain['host'];


//$domain = 'flickr.com';
if($domain == 'flickr.com' || $domain == 'www.flickr.com'){

	require_once("flickr/phpFlickr.php");
	require_once('flickrLicenseCodes.function.php');

	//create flickr instance & enable caching
	$f = new phpFlickr($api_key);
	$f->enableCache("fs", "/home/photosafe/public_html/api/flickr/cache");

	//find the photo id
	$flickrUrl = $parsedomain['path'];
	$flickrUrlArray = explode('/', $flickrUrl);
	if(!array_key_exists(3, $flickrUrlArray)){
		$statusCode = 400;//bad request
		$error_message = 'Invalid Flickr URL';
	}else{
		//parse actual flickr photo info
		$photoid = $flickrUrlArray[3];

		//return license information
		$photoInfo = $f->photos_getInfo($photoid);
		if(!$photoInfo){
			$statusCode = 400;//bad request
			$error_message = 'Invalid Flickr URL';
		}else{
			$licenseInfo = getLicenseInfo($photoInfo['photo']['license']);
			$owner = 'http://flickr.com/' . $photoInfo['photo']['owner']['path_alias'];
		}
	}
	echo json_encode(array(
						'status' => $statusCode,
						'domain' => $domain,
						'license'=> $licenseInfo,
						'error_message' => $error_message,
						'owner' => $owner,
						));
}//end flickr
else if($domain == 'instagram.com'){
	require_once('instagram/Instagram.php');
	$licenseInfo = 'Instagram license';//instagram license info

	//find the photo id
	$instagramUrl = $parsedomain['path'];
	$instagramUrlArray = explode('/', $instagramUrl);
	if(!array_key_exists(2, $instagramUrlArray)){
		$statusCode = 400;//bad request
		$error_message = 'Invalid Instagram URL';
	}else{
		//parse actual instagram photo info
		$photoid = $instagramUrlArray[2];

		$instagram = new MetzWeb\Instagram\Instagram($instagramAuth);

		$instagramMediaInfo = $instagram->getMediaShortcode($photoid);
		$owner = 'http://instagram.com/' . $instagramMediaInfo->data->user->username;
	}
	//echo var_dump($instagramMediaInfo);


	echo json_encode(array(
						'status' => $statusCode,
						'domain' => $domain,
						'license'=> $licenseInfo,
						'error_message' => $error_message,
						'owner' => $owner,
						));
}//end instagram
else{
	$statusCode = 404;
	$error_message = 'No domain data found';
	echo json_encode(array(
						'status' => $statusCode,
						'error_message' => $error_message,
						'license' => $licenseInfo,
						'domain' => $domain,
						'owner' => $owner,
					));
}

?>