import Background4 from "@/assets/user.png"
import Background2 from "@/assets/Login.jpg";
import Background3 from "@/assets/Login22.jpg"
import DHBWLogo from "@/assets/DHBW-Logo.svg.png"


import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import {apiClient} from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { MdEmail, MdLock } from "react-icons/md";


const Auth = () => {
    const navigate = useNavigate();
    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //Überprüfe ob alle Angaben beim Regestrieren richtig sind
    const validateLogin = () => {
      if (!email.length) {
        toast.error("Email ist required.");
        return false;
      }
      if(!password.length) {
        toast.error("Password is required.");
        return false;
      }
      
      return true;
    };

    //Überprüfe ob alle Angaben beim Regestrieren richtig sind
    const validateSingup = () => {
      if (!email.length) {
        toast.error("Email ist required.");
        return false;
      }
      if(!password.length) {
        toast.error("Password is required.");
        return false;
      }
      if(password !== confirmPassword) {
        toast.error("Password and confirm Password should be same.");
        return false;
      }
      return true;
    };

    const handleLogin = async ()=> {
      if (validateLogin()) {
        const response = await apiClient.post(LOGIN_ROUTE, {email, password}, {withCredentials:true});
        if(response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) navigate ("/chat");
          else navigate ("/profile");
        }
        console.log({response});
      }

    };

    const handleSignup = async () => {
      if (validateSingup()) {
        const response = await apiClient.post(SIGNUP_ROUTE, {email, password}, {withCredentials:true});
        if(response.status===201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
        console.log({response});
      }
    };



  return (
    <div className="h-[100vh] flex items-center justify-center">
    <div className="h-[80vh] bg-white border-2 border-white 
    text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] 
    xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
      <div className="flex flex-col gap-10 items-center justify-center">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-bold md:text-6xl">Wilkommen</h1>
            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
          </div>
          <p className="font-medium text-center"> Starte mit unserer Chatapp!</p>
        </div>
        <div className="hidden xl:flex justify-center items-center h-[50px]">
          <img src={Background4} alt="background login" className="h-[80px] w-[80px] object contain" />
          </div>

        <div className="flex items-center justify-center w-full">


            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger value="login"
                className="data-[state=active]:bg-blue-100 text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:fontsemibold data-[state=active]:border-b-blue-900 p-3 transition-all duration-300 "
                
                >Login</TabsTrigger>
                <TabsTrigger value="signup"
                className="data-[state=active]:bg-blue-100 text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:fontsemibold data-[state=active]:border-b-blue-900 p-3 transition-all duration-300 "
                
                >Signup</TabsTrigger>
              </TabsList>
                <TabsContent className="flex flex-col gap-5 mt-10" value="login" >

                  <div className="relative w-full">
                  <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl" />
                  <Input 
                   placeholder="Email"
                   type="email" 
                   className="rounded-full p-4 w-full pl-12" 
                   value={email} 
                   onChange={(e)=>setEmail(e.target.value)} 
                  />
                  </div>

                  <div className="relative w-full">
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl" />
                  <Input 
                   placeholder="Password"
                   type="password" 
                   className="rounded-full p-4 w-full pl-12" 
                   value={password} 
                   onChange={(e)=>setPassword(e.target.value)} 
                  /> 
                  </div>

                  <Button className="rounded-full p-6 w-full bg-blue-900 hover:bg-blue-600 text-white transition-colors duration-300" onClick={handleLogin}>Login </Button>
                </TabsContent>
                  
                <TabsContent className="flex flex-col gap-5" value="signup" >
                <div className="relative w-full">
                <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl" />
                  <Input 
                   placeholder="Email"
                   type="email" 
                   className="rounded-full p-4 w-full pl-12" 
                   value={email} 
                   onChange={(e)=>setEmail(e.target.value)} 
                  />
                  </div>
                  <div className="relative w-full">
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl" /> 
                  <Input 
                   placeholder="Password"
                   type="password" 
                   className="rounded-full p-4 w-full pl-12" 
                   value={password} 
                   onChange={(e)=>setPassword(e.target.value)} 
                  />
                  </div> 
                  
                  <div className="relative w-full">
                  <MdLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-2xl" /> 
                  <Input 
                   placeholder="Confirm Password"
                   type="password" 
                   className="rounded-full p-4 w-full pl-12" 
                   value={confirmPassword} 
                   onChange={(e)=>setConfirmPassword(e.target.value)} 
                  />
                  </div>

                  <Button className="rounded-full p-6 w-full bg-blue-900 hover:bg-blue-600 text-white transition-colors duration-300 " onClick={handleSignup}>Signup     
                    {/*rounded-full p-6*/ }  
                  </Button>
                  </TabsContent>
              </Tabs> 
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background3} alt="background login" className="max-h-[80vh] max-w-[100%] object contain" />
        </div>       
      </div>
    </div>
  );
};



export default Auth;