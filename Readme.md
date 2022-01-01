Link: https://salozone-server.herokuapp.com

<h1>Registration flow</h1>
<ul>
<li>
First Route users to "/mobileregister" route, to let them register their mobile no.
</li>
<li>
After successful registration redirect them to "/:id/verifyotp" where they will be asked to enter OTP  which they recieved
 on there Registered Mobile No.
</li>
<li>
After Submission of correct OTP, User will be a Verified User and rediected to "/:id/signup" where they can Register their Email
and Password for login into the Account.
</li>
<li>
In order to Create an account, User have to each step in Order, otherwise they will not be able to SignUp or create account.
</li>
<li>Now Users can LogIn into their Accounts using their credentials they used at the time of Registration at route "/login".
<ul>

<h3>Note</h3>
On Successful Registration of Mobile No., You will recieve the User ID in response from API. Please use that ID in following 
Routes:
<ul>
<li> /:id/verifyotp</li>
<li> /:id/signup</li>
</ul>
