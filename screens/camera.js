import React from "react"
import {Button,Image,View,Platform, Alert} from "react-native"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"

export default class PickImage extends React.Component{
constructor(){
    super()
    this.state ={
        image : null, 
    }
}
getpermission=async()=>{
    if(Platform.OS !== "web"){
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if(status !== "granted"){
        Alert.alert("Sorry, We need camera roll permissions to make it work!")

    }
    }
}
componentDidMount(){
    this.getpermission()
}
pickImage = async()=>{
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(! result.cancelled){
          this.setState({
              image:result.data
          })
          this.uploadImage(result.uri)
        }
    }
    catch(error){
        console.log(error)
    }
}
uploadImage = async (uri)=>{
const data = new Formdata()
let fileName = uri.split("/")[uri.split("/").length-1]
let type = `image/${uri.split('.')[uri.split('.').length-1]}`
const fileToUpload = {
    uri:uri,name:fileName,type:type
}
data.append("digit",fileToUpload)
fetch("",{
    method:"POST",
    body:data,
    headers:{
        "content-type":"multipart/form-data"
    }
})
.then((response)=>response.json())
.then((result)=>{
    console.log(result)
})
.catch((error)=>{
    console.log(error)
})
}
render(){
    return(
        <View style = {{flex:1,alignItems:"center",justifyContent:"center"}}>
 <Button title = "Pick An Image From Camera Roll" onPress = {this.pickImage}/>
        </View>
    )
}
}