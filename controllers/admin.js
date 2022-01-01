const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose')
const axios=require('axios')
//token
const mapbox_token='sk.eyJ1Ijoic2Fsb3pvbmUiLCJhIjoiY2txb3kzMzBuMDRqcjJ3cDNteTFxOTdoOCJ9.TpcJeyUKfLp9jI9LOhuRvA'
//models
const Admin = require('../models/admin');
const Services = require('../models/services');
const Offers = require('../models/offers');
const Booking = require('../models/bookings');
const Promocodes = require('../models/promocodes');
const Deals = require('../models/deals');
const UserMadeCombos = require('../models/userMadeCombos');
const User = require('../models/user');
const Employee=require('../models/employee');
const router = require('../routes');

// admin login
exports.postAdminLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const currentAdmin = await Admin.findOne({ email: email });
        if(!currentAdmin){
            res.status(401).json({msg: 'Admin not exist. Please SignUp first then try again'})
        }else{
            const passwordMatch = await bcrypt.compare(password, currentAdmin.password);
            if(!passwordMatch){
                const error = new Error('Wrong Password');
                error.statusCode = 401;
                throw error;
            }else{
                const token = jwt.sign({
                    email: currentAdmin.email,
                    userId: currentAdmin._id.toString(),
                    role: currentAdmin.role
                },
                'supersecretkeyforsalozonewebserver'
                );
                res.status(200).json({ token: token});
            }
        }
    }
    catch(error) {
        console.log(error);
    }
}


//admin register
exports.postAdminSignUp  = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const currentAdmin = await Admin.findOne({ email: email });
        if(currentAdmin){
            return res.status(409).json({ msg: "admin already exists. Please log into your Account"});
        }else{
            const hashedPassword = await bcrypt.hash(password, 12);
            const admin = new Admin({
                email: email,
                password: hashedPassword
            })
            
            const result = await admin.save();
            console.log(result);
            res.status(201).json({ msg : "Admin Registered"});
        }
}


//get all services or filter by giving type 
exports.getServices = async (req, res, next) => {
    let type;
    
    if(req.query.type){
        type = req.query.type;
    }
    let name;
    if(req.query.name){
        name = req.query.name ? req.query.name : undefined ;
    }
    try{

        if(type || name){
            const response = await Services.find(type && name ? { type: type, name: name} : (type ? {type: type} : {name: name}));
            if(!response){
                res.status(409).json({ msg: 'No service found with this type'})
            }
            return res.status(200).json(response);
        }

        const response = await Services.find();
        if(!response){
            res.status(500).json({ msg: 'Server Error, Please try again after some time'})
        }
        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}


//add services
//use content type as formData, this will not work on application/json
exports.postServices = async (req, res, next) => {
    const id = req.body.id
    const name = req.body.name;
    const type = req.body.type;
    const basePrice = req.body.basePrice;
    const discountedPrice = req.body.discountedPrice;
    const product = req.body.product;
    const imagePath = req.body.url; //use name='image' for the input field of image
    //const imagePath="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxETEhUTExIWFRUXGBcXGBgYGBoaHRgYGBgXGBgYFxsYHyggGholGxcYIjEhJiorLi4wFx8zODMtNygtLisBCgoKDg0OGhAQGy0mICUuLS0tLS0vMy0tLS0tLjUtLS0tLS0tLTUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS01Lf/AABEIAMIBAwMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAAAgMEAQUGCAf/xABCEAABAwIDBAYIAwYFBQEAAAABAAIRAyESMUEEIlFhBRNxgZGhFDJCUrHB0fAGB2IVI3KS4fEzQ1ST0jREgpSiFv/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACsRAQEAAQMBBwMEAwAAAAAAAAABEQISUSETFDFBYXHwAzKBIpGhsQRSwf/aAAwDAQACEQMRAD8A/uKIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIuOcBc2C8U/jDo3H1fp2zY5w4eupzOUZ5zog9tFFjwRIIIORFwV0mLlB1Fgr9N7Ky79pot/iqMHxKz0vxT0e54pt23ZnPOTRWpknkAHXQeuiIg/n349/NHZ9hPVUA3aK8kOAfDKUe+4Ay6fYF85ItP882386Okn+ozZ6Q5Mc4+LnR5L4J2xGfWHmg2I8Qsdpo5cL9R9qPzb6XEHraJvkaQg8jBlexQ/PPagIfsdFztS2o5o/lIdHiv5c7YjxPgVW/ZSPePYw/VJ9TRys1Xl/V3fnxWH/Y0/953/AAV/R359DGBX2LCzjTqYnD/xc1oPiv46dn/S/wDlUXUY9l/33K79PLW6v1h+G/xlsG3NB2faGFx/y3HDUHax1+8WXvr8VuY33Xffct9D8R7VTaGU9p2hjRkG1nt+BCbm5X7FRfj0fi3bv9btX/sVf+S07N+PekmAhu27RBEHFVc49xcSR3K5Mv1yuEr8g1vxn0g8AO23aYHCs8eMG/eslPp/aWjCNorAcOtfHxTJl+xam0sbcvaBzIWGt+Idjb6200h2vb9V+Q63StV1nVKju17j8SqOtHBTKZr9ff8A6rYP9XR/nCnV/EmxNbidtVENGpqN+q/H/Wt4KP7vgm4y/ZFDprZXtDmbRRc05FtRhB7CCtNDa6bzDKjXH9LgfgvxfgpxMdwVuz7Q1jg5mJjhkWuLSOwtum5cv1f+K/xtsPR4A2mrDyJbTYC57hlOEZDO7oFiv5nt/wCfu+ep2GaehqVcLjzLWtIb2SV/IX7S0mXYnOOZJJPaSTJsg2lnu+Q8VN/oltf1Zv5+1Z/6Bn+8f+C+p6H/ADu6NqQKza2znUubjb3GnLvFoX8FG0MifLkqsNNxkyJ+H1U7T0SW+b9RUPzH6IeJG30R/ES0+DgCvB6Y/OnoulIpGrtDpj92yG/zVMNuYlfnvqaMTLvH6hTp0aXF+U5j6J2kay/pPSX56bc8nqNmo02zbHiqOjuLRPcvmtu/M3piqZdtjqYmQ2mxjAOUhsnvJXz7KFKYl/O/FTp7LR953iDfgpfqxnqdI9PbXtO7X2qvWBM4X1XFsjXCThHgs1PZQcwI5H42W1uxUc8Thpnn2Qpeh0h7R8Ry17wsX6kMI7OXsGFlaqxo0bVcBfkLLm0vc8Q/aKjhwe8uHgbKXodMe2RlaxzUvQqd/wB5x04LPaeqvMdSpj22/wAsfBc9FJywuHI/VehU6Mp+/fgBf7uu0uihm14js+5W+2k82dq3YvxJ0nRY2nS2raGMaIa1tUgNHACbBFWdiAt1zfvvRTt4uGmBp5LhH2VoNAawe9OpGk+Z+cr526PDuUAff9lyVoNMcRPgV0UO3uM/FN0Ms5P3/ZclaOrb92TqB73z+Vld0Msx7/vtUCFrFHgR5/JROz8fiPmrNUXLGWqJpjgFsdQ5Hw+igdn5+MLU1wyxupN90eAXOoZ7jfALcNmPH77k9EPHyV7T1Xd6sA2VnuN8EOxU/cC9E7LxHkVwUB2J2t5N95ed6DS93zP1Xf2dS4HxK9AUhx++8lSbS5hO21c1O01cvN/ZtL9Xj9Vz9k0/ed4j6L1hR4QV3qTyU7fVydrq5eR+yG+87yQ9EDR58B9V7I2c8PP+i71Cd41cnba+XiHobg//AOf6p+yT748CvdbQUhR5hO9a+TvGvl4P7IfkHt8/pyHgjuiqsZt8f6cl9D1B4jkpdQfuPqs971HeNT5s9HVYsAe/ioeg1x7HcCPqvp+q5cdPogocvJXver0O86vR8kdlrDNjrd6rdSqDNjuN5+/7L7IU5+z9FLqgr32+cXvV4fF4nARBHd59uaqdUOnNfcCn4dhXDswOYB7h81qf5s89K97nD447RAiTFrHlxH3mh2l0udivpAgCTewiM19c7YaerG/yj6Kt/RVI/wCW3wVn+Zo4XvWjh8q3an6CecT23RfSnomh7nk75FcWu9/T4q96+nxW3qWnJp0yy/snU8DFuHh8JV/UuvGCAfeMkXuSbffcrWUzBFhF/WJ88183c82WPA69xHG4+KFsafDTsutlNnIGLy12uUkk556IGxALSb8NLa345puMsoHb3g/O649g5efxW5tEGwaSeYPM5FRqbNJnentMR2Aga5KTXDLG6iM5+8/gqzROp+f35reaYgm/hPzuoOoDmI4g+UWGfnyVmsyw4YHzy+il1ZWx1Fwi9rDOJ7ZE2Erg2ck3aBzBtab627Fd5liNHsPgu9QMovyPDvWs0nGIaY5Yc+N+8qQ2dx5GcrEzzm3FXeZZeoOk/FPRuJ8vDRaXUyI+ThOek5j77OkEEQCcpiXcLjA34rO6plmGzz9hdGzDQDQfdloa5vGzbSWkR35G6lgiMyeQcL+GeiXVUyyOoa6G2Yz4CbFPR9NY+9bdi3NrOsc+2RYd05FJLheQZ5R2WBy+am/UZrE7Zjx7pI8oPBcFM+PMZjtC3Gk+fYji6eyIAsFeQ7kYGhzI90KX6ibnmikdYHbHyXRTdbI56cLaHit4f+m+V4NzpfPKPFWYgNAJMAQInXIaH4LPaVMvNYx0erA5NUj2HsEzn9+K2hoJtE9jgJkWta6tkiBEmRNzbumND4qXWXU88ZzfhFvOV1o7eMwIP9F6EyYLRpf7Hfb5I1jZuyJGvlz7Fnf6JLGJ7st7st5woNM2BbxvI5X52XoAU8wM9IidOU/1UXU6fGDM8OLjqm/0TLG0Hg09nLT74LhpGJDY7h9FslhNnE2ga63Im4yXHNBB9W/Md0RprHZ3tyZZyzWDnfh2FQj9Ed8doklan7Ne09tjMwYyz+vFcfTOWOMpy7wPvzSajLKGN1afELq0AOHtDxZ9UV3UyhT2WwGFhF8rA53zg3jKc+S4NkJ0aAdASRE93dqrC7Qup6ZtII5X9XIXum6YkhtpiRoMyRkI0jhYLWa6o09nwCDhAHs8yASN4zJHzXWsqTvsY1p1FSLZiwg59iu2hgMNwlwB9kyAReHSZMgGS7j2KJ2drolrXAGxBkgn3QYbxm5+kzz8/kce1uRbGXEnnabg/JUMcwjiOy1jxFrTlndahTIEMptABNxe+gEmW5C0cMlWNpe2JpSDiu2+HDo7DIvGedxyVk4/sw5S2JseqBGZxG06ZZX7Lc1OrQAJNgLetbM537+2F3raz8O40TO66RpGsRBHmFGnTBzjMgNBI1AAGotOnjKlz506uDZTcQJuI0v9+S41mQJBnhz+MZW5KXoeczc3vE4RfOdYtFlL0UDLFebNcMrndJsND3cBKZnKIOpgAyBJyEjMzqR26fBTFNusR3+XG/wUTTcCMNMkdvIxEXIM5nh4zbUJDtyIuCbxnAjU2Hgb8GBVgaZkQLznHZfPPttfgoVYsdNZnLzOZz7VfTqvMtJuAYa4QYIIkxcffYq6b3OBGAZgYgc7RDYFwI4a+FxTqUqDTEHDEEbzsosc4BnjeyuFETxPtEONrDO+Qnl5qv0Zt5cZBtvEzMGCW2IEHj2qvqoww0zOpi9tAeIiTle11MZ8yxcKAnEDJMiSXcgABkDM8dUFJsu3nA5mHm9pymOf9woGIIktIJuTeJ9bKwtnyyU6myANIFoFpmSTE4eeXHJMc1MJdQHxE9oPbP3kYXalNogWGnhPE9nhE6qQLZwyDbjc3yl3xKhVotxE4TpZrcyThk3NpPIW5Wz5phym0T6xjiTNu0mO7gVJ7RqSJjDisMjkde+9yuGiDeZdBaIJjh7J/VwU2Uw24kkmM5xG2pA7hfIcVKDyPegC2YzvYyL84uoHZmi8HkQIgxfmc/NW02uviEXIjjmTlYWLYvxVRv6zCXGAIBMDK0jO4lSeiOwAd926M9420jP7jnadCeDgMgTHHPede8+XdY+kfZOEagtjeN51m98te2IMaXHE9pJdqSYGZkmIsYHdMWU8YmFRIInFneIdBbBJkzkfIcYVjabMM4rRGovwwg71yotA6wSRY4YOpzN7TYHvHHKAawEk4WGbExlMMIBnTW02te9wli+GiCBla9pmIzECx4qGJrIm1xaCPgbnh58FBri44gx0AYsZJMZnEZzgcRaSuUwAZdhndc0mQDAm5boIBiLHjMKbeTC3rKIETvAAm7pM8BIvfVQinMhpNpHO1oE5/wBVbUqgsgAubJkwZcdLfXyUKjQPawuAEwDAaYMAZTYWtme1JPckU1quz4jJE9v9UWmnTIAuw+fn1g++OaJnTz/JnTyy9RSLZLnAAxGIbwGgF8YM3IM73Irrq1B7YiWtgnDrGuKbWHOFY3Z6bcLizfEkEuLwHGM3D2o0kGxztEuoaRYNDt4gYAYGeKIzyzyz5rvmerv0U0ttotk4IbJvh3c4udZJAmDleTdSq9LUqbQSIb7IkGxgktIOVtOC6aow4ZABABkHCcQDYLQDaPllEqymGMAaSMV7OyJJMne7gM7QpZp8bKdFLOkqboAcZIBgXLSZboYcc7cBzVrdoDRvEmGkjdLWwZvI4kEydOMyuv2gQ4lwdxaWy0m4De657YyvOelXbAhjWC5hhmxAmzGwDMEzExzkXbL4Sm2WdFza5DS5twAQXYRYnXKIwnManJSdWwuaMYuBhHqmQTEXjEceQzuMpVb+kGhow4SQ4mxLTM3sBIPOc5sMkp9JDDDSMTz7N4AvugezMyRlqbJsvlFsx4OCg+xe9oGKWtJFgZJGhMCOEaartBgHtNjMYZaXCJkkun2fVFoOqUmAb7mtJFhcw2TJBDWtI3syL3PCFTtVdxu0AWsMMOOUwSJ3QON8PbDFvQxlMOlxa58EAQSTJi0ltgBJBvYX5KdIlpaDUxOnIMJGnAyYjObdyqfXe0B2HFMgGTItcwYm+mYkQo0SIODIA75GFzRjdJxxIG6bRp+kzdtwmK0+kMiDFhJcCeIA3tDMiF2vtIaIwOvaTJytLo3gJkT2XUaDcsJ3Zb61pk3taNO0wCq6tKoQ8hxolxMbxcSARhnEbOMa5YRks7JL1LpixrKNg1mN0Ey28ZQARnaBfWO+wMtDGwYyh5w3nEQcwQASOY7q2tcRera5vaxFjAkiwyIkkiwC6NnIDhjAIAaDEzaDO6PEEd2Sl92a0tpE4nbsPzBzJsYIJMm893jWHWEPwk2EstABkgwInPKLnRcbSkiXsIuBBF2Agu9YQTAvmIGZVfpRBhopjEQDBu4DsuBA5LEiLsYBLGmBrLXQ4nPEWxoc/lcwNUQZdiAEw2Ta0DB7saByrY5jcTQG728Q8E2gDE4OyuRaI7sqW7W1zxusMC5BLbXt+rI20k5Stbc+S32SbVYXObidJLnA5zYiXTkyASJzzvdW9SSN5z3AgNJa4SSJHq3I45WBU21mBuIiJ0ccO8cy64GKByNhoLcf0hT9UnABAAOJxmxM6SLa248FvEPLwUOwOMtqPExGF2IEEcJubjLmbEK19NjZDZl3E5e86SZzgWnI90XdKNlzSBhEgAwYdMzGGLRmMu8Js+1EkkDq8QguxRIAMSDZxJOUTe2i1i+YuwMOTgTAOI5jFi1gQTMSTHYoO2dkSMQa0b2ThzF763MnS65V6QYW4WzMQTOYiZcBpld2cwo1Tia7E8OwtnEGE2BuRc2BJFuAy0xjUjbULS2WAkGeAaLki8iRcZanmo06TBAc0Em7RPuyQRAtE3MA5jWF5j6tNxdOIw0AAGJm7TpJknvFogK00QLva4QAGgY4POMV5gxPPgQl0Y80sw11qLCd+cwMLbNBwnELtG7B14yeKjT2dgdLALENBGd5kA2IEaG5usYdJFSnu4gf8QNIdpYOcQYi/wDFxVlUjeIwxJAkAkCMpiCQCTAPs24JdOPCmML3bGyMJcSWkjEd42AAEAudMxcmJk8lZ6PSLTd1nEkdYIEm0wdDiEE6FZMeA4mteJmHEEGYiQTZrWjgBrYp11M0w6ZA1HvGxMAzBmADe1tFLNXKdb4tYZS0o4/1S4d0C0jLuXVhfSgw+njdAl0vE2tAY0NAi0DguLe28tZvKtj6bCWtBecyBdonNpkEkSeOfcoYGOdLGkYKnsMBkutd7sgS3Ma8LLRWcaeJzKdnFuMxckFxAg3NyDncDkU2jb8Jm02gAicwcZaCZE4uFySuktz0b8LlzZ2NJlrTAmS5pgHdvvGGiIFpyMSuuosLW4g0mzSDvTqIJGQmJjv4zp7SXDE1hIMBpIfBIJ0AI9WBYxunK6bTWZJaGHrMJzIzw7znA3bBgYj5QVM6rSW1VS2L1YmTaDIAh0EhmKCY+B4LW5tNrpkuOGIGvD/D7vDsWd1cUi0mSRuh4My4wQcTpAta0xIvK7s+F4OIvkEThLQJJsXTBvJ8B3rm9bejUnnV+zUGUmtmobg2wth0mAZtBgAZXtK5VezASdwbkEAkho5+7AbceGgyjCQ7A8DFLQ3E0wRqARFPLLWOOWfaK0BpGKqx7olwzgmMRAgRbMEWjQJNFt8UmluwU3yTUxkwMRBMiwwkZG4yg3Fs7yIoh2PFnG8JItcWjWM/4e/FstMPwtO6GkkhwMvYS0nebFjM5SZ4SrX7IKrn+y0EwGloAPFskXnV2UC05NuLi0919XaZcwls6giSIPq24T238o1ax6svIOGbkRutnCIIyM5NJzBKw/s+pIl+K8DdwnKRAuHGDOURHdvZR3TSkgjRsYTHvRhc4X1A9WBlCWaZjFTpFb9qpGAIDciTGskExFyeZEm5Kqr1KThic8GSWjcaIbBBZlaDJBnhktNIMbhx5gRgvhJwm1iIImSCbZWmVKkGzLjBLcyMTognCNXZCwzwlZ6Twz8/CezL6NQwOa1wnC32njtdb2ZjXKFmHRgLQ4VcYAkyWsvDjF2mBHGTcrSGbO0k1YLo3g6TZxLZwgkGCSJIBEAiMzdjpMDg7CJMtmZAiQQBHCw0kZ69N9nhlcoGk1syz1t6HHELgAMkmcALeA7tM7adK4LiRmBbeBbMAwNy53bDWVtr7XTADWsa6YDZOHMuvJEAmePG3Glm0b2EkNwG4kh2E5YjMmAZuTkpLcdRCqylUD3BmFwIcWmRugCBDDuthxBMXvnmr6Wy4QWwZgh2HIGZcYN3Ftr9/bGrVLqZLgKhkOEwSQ4tjBEk2DbCRZwV5aHMk03EgxutGAWdm0gA+rmZzOSl1XBu6PNrsploaA5oZOB2KxNpw2OZBvvRaw10VaVNsua+xF2m9MVDDiCS2YGIkE58DMDXhpuOFzcZnA0OABGEYrG4FhGY05xVtW0Na0tpva0RmJzIyBkB04bybjWyu/Vehuvmq2TZBSYGNY1zzed0gSXOBIDiGgRaRoSM4FBrNDxDAHmZJdbFhcQ4ElwzgyLSLm8re2qxxGHE7Cy7pFi6YLiThkiIBJz7lKsxgeHitJAOIH2sJG6MJxRJyl3fAWd/W5S3qwvo0dx1iHRmBAu5ow4iSbl1zqWwYK09IsbTmBOMjDnDiThgEgkmbkZW5yu13MMNO9FOS7JxcAIBA3i4yY7TwtQ9wbUDAMJjERDbFuWFzTisJMTbITCS58UtaRTYyYaxhAJ1knEze94RvXJF+0TmfXbZgBebgi7g12ttMx/NndaMRY4YThZhJ3YmXauDSbQ6dTAVjRvump7kTxkAgmB7RmJPqwsZ5TKuk14bEvfJu4gRAbAGVuWERzuqXbQQDipmmMQqRhsZEAzla2ecg6LS9zWhuANeTeXAgOuZl1S8Q06nJV0w7Kpha3C4EFrQXAOsGAtnO3CCMtEvnZ89kjLQ6XNQuIaBAgxcAkiW72WR5AcJVlba6kOcAHgBwBAFwDDyL3E4cgchZaK9SluMvBGBoMYQ47ojETFgLk89AsRpvcAYc4SGUy0Q1wJi0NMXESIs0HjG9M03rI1JLejRSfVcA4ddBvawnWwIi/JEqUBJ/evbfIFoAOsBwJieJRXM9EzHrVxhccO76mVs8U5Kzo2gxza2JrTvagHOAc+S6i9Vk2/s9GOkV+h0rnq2S1gI3RY4SZFrGVDY9kp4J6tsxnhGskoiX7f2NX2RMsDXNDQAJJgCBPVgzbWST3qyhSbjqDCIBfaBpSYR5knvRFdUn9/207s+zs6z1G2wRYWikQI8T4rtGk3dOESWvJMC5BcATxMIi52T+J/1yvh+F7dnZ1LTgbOI6Dn9B4LHsFMHZ3GBeoAbZggSDxCIrNM/V7t6pP1N42amGghjZOZwi99fAeCp6P2WmXU5Y0y0TLQZvrxRFyx+nU5f7ezzdrpta5uEAS28CPWcJy46rVtNJvWu3R/iNGQywvPxuiL1bZj93TyV9KbFSNRwNNhHV4vVHrYs8s+ajs2zU3UKmJjXfujmAciYzRFm/ZPeNa/CNez7MyKZwNktAJgXAcAAeUKPozGkYWNGLCXQAJJ1MZldRXRJj5y3pkwopU2uFYuAcQ2ASJgAGAJ7B4BPRafWt3G2BjdFpL8uCIs2TN9nPV438tHRmzsGBoY0NLKriABBdipjERqYtK8za6bcZECIfaLX6uURb0SbvnKzyXdGbOw0zLG+A0wR4SfFWigz93uts4RYWzyXEU1SZrOrz+cNGybNT3zgbODPCJsXR8Vi6PpiaxgThiYvlGaIuckxq/DGn7Ku2qk0UmgNEPDcQizopyMQ1uAb8Aot2Wm41sTGnDQbhloMeqbcLk+KItSTHzmNz7fnJSotwE4ROM3gaYSPMA9y9ClSa+A9ocC15IcJk2uZXUXP6sjlq8Pnq+frbOx1NxcxriXukkAkwGxmvWGy0w2QxoILIIaLb2iIu2ueHu3qQ22q5ry1ri0CIAMDIaBERZmjTjwdsR//2Q==";

    try{
        const currentService = await Services.findOne({ name: name, type: type  });
        if(currentService){
            return res.status(409).json({ msg: 'Service already Exists. Try editing or deleting it'});
        }
        const currentTypeService = await Services.findOne({ name: name  });
        if(currentTypeService){
            return res.status(409).json({ msg: 'Service already Exists with this name. Give a type to it or try editing or deleting it'});
        }
        const service = new Services({
            id: id,
            name: name,
            type: type,
            product: product,
            basePrice: basePrice,
            discountedPrice: discountedPrice, 
            imagePath: imagePath
        });

        const response = await service.save();
        return res.status(201).json(response);
    } catch(err){
        console.log(err);
    }
}


//edit services basePrice and discountedPrice
exports.editServices = async (req, res, next) => {
    const name = req.body.name;
    const newType = req.body.type;
    const newProduct = req.body.product;
    const newBasePrice = req.body.basePrice;
    const newDiscountedPrice = req.body.discountedPrice;
    const newImagePath = req.body.url; //use name='image' for the input field of image
    //const newImagePath = "data:image/jpeg;base64,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";

    const currentService = await Services.findOne({ name: name });
    if(!currentService){
        return res.status(409).json({ msg: 'No service found with that name'});
    }
    currentService.type = newType ? newType : currentService.type;
    currentService.product = newProduct ? newProduct : currentService.product;
    currentService.basePrice = newBasePrice ? newBasePrice : currentService.basePrice;
    currentService.discountedPrice = newDiscountedPrice ? newDiscountedPrice : currentService.discountedPrice;
    currentService.imagePath = newImagePath ? newImagePath : currentService.imagePath;

    const response = await currentService.save();
    return res.status(201).json(response);
}


//delete services
exports.deleteServices = async (req, res, next) => {
    const name = req.body.name;
    //const type = req.body.type;
    //const product = req.body.product;

    /*if(product){
        const currentService = await Services.findOne({ name: name, product: product });
        if(!currentService){
            return res.status(409).json({ msg: 'No service found with that name'});
        }
        const response = await Services.findOneAndDelete({ name: name, product: product });
        return res.status(200).json({
            msg: 'Service Successfully Deleted'
        })
    }*/
    try{
    const currentService = await Services.findOne({ name: name });
    if(!currentService){
        return res.status(409).json({ msg: 'No service found with that name'});
    }
    const response = await Services.findOneAndDelete({ name: name });
    res.status(200).json({
        msg: 'Service Successfully Deleted'
    });
    }catch(err){
        console.log(err);
    }
}

//get offers
exports.getOffers = async (req, res) => {
    let name;
    if(req.query.name){
        name= req.query.name
    }

    try{
        if(name){
            const response = await Offers.findOne({ name: name });
            if(!response){
                return res.status(409).json({ msg: 'No Offer found with that name'})
            }
            return res.status(200).json({response: response})
        }
        const response = await Offers.find();

        if(!response){
            return res.status(409).json({ msg: 'No Offer found with that name'})
        }

        return res.status(200).json({response: response})

    }catch(err){
        console.log(err);
    }
}

//post offers
exports.postOffers = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const services = req.body.services;

    const imagePath = req.file.path;

    try{
        const currentOffer = Offers.findOne({ name: name});
        if( currentOffer){
            return res.status(409).json({ msg: 'Offers with this name already exists'});
        }

        const offer = new Offers({
            id: id,
            name : name,
            services: services,
            imagePath: imagePath
        })

        const response = await offer.save()
        return res.status(201).json({ msg: 'Offers Saved', response: response});
        
    }catch(err){
        console.log(err)
    }

}


//edit offers
exports.editOffers = async (req, res) => {
    const name = req.query.name;

    const newServices = req.body.services;
    const newImagePath = req.file.path;

    try{
        const currentOffer = Offers.findOne({ name: name});
        if(!currentOffer){
            return res.status(409).json({msg : 'No Offer found with that name'})
        }

        currentOffer.services = newServices ? newServices : currentOffer.services;
        currentOffer.imagePath = newImagePath ? newImagePath : currentOffer.imagePath;

        const response = await currentOffer.save();
        return res.status(201).json({ msg: 'Offer Saved Successfully', response: response})

    }catch(err){
        console.log(err)
    }

}


//delete offers
exports.deleteOffers = async (req, res) => {
    const name = req.query.name;

    try{
        const currentOffer = await Offers.findOne({ name: name})
        if( !currentOffer){
            return res.status(409).json({ msg: 'No offer found with that Name'})
        }
        const response = await Offers.findByIdAndDelete({ name: name});
        return res.status(200).json({ msg: 'Offer Successfully deleted !!'});


    }catch(err){
        console.log(err);
    }
}

// get promocodes
exports.getPromocodes = async (req, res) => {
    try{
        const response = await Promocodes.find();
        if(!response){
            return res.status(409).json({ msg: 'No promocode found with that name'})
        }
        return res.status(200).json({response: response})
    }catch(err){
        console.log(err);
    }
}

//post promocodes
exports.postPromocodes = async (req, res) => {
    const name = req.body.name;
    const minAmount = req.body.minAmount;
    const discount = req.body.discount;
    try{
        const currentPromocode = await Promocodes.findOne({name: name});
        if(currentPromocode){
            return res.status(409).json({ msg: 'Promocode with this name already exists'});
        }
        const promocode = new Promocodes({
            name: name,
            minAmount: minAmount,
            discount: discount
        })
        const response = await promocode.save()
        return res.status(201).json({ msg: 'Promocode Saved', response: response});
    }catch(err){
        console.log(err)
    }
}

//edit promocodes
exports.editPromocodes = async (req, res) => {
    const name = req.body.name;
    const newMinAmount = req.body.minAmount;
    const newDiscount = req.body.discount;
    try{
        const currentPromocode = await Promocodes.findOne({name: name});
        if(!currentPromocode){
            return res.status(409).json({msg : 'No promocode found with that name'})
        }
        currentPromocode.minAmount = newMinAmount ? newMinAmount : currentPromocode.minAmount;
        currentPromocode.discount = newDiscount ? newDiscount : currentPromocode.discount;
        const response = await currentPromocode.save();
        return res.status(201).json({ msg: 'Promocode Saved Successfully', response: response})
    }catch(err){
        console.log(err)
    }
}

//delete promocodes
exports.deletePromocodes = async (req, res) => {
    const name = req.body.name;
    try{
        const currentPromocode = await Promocodes.findOne({name: name});
        if(!currentPromocode){
            return res.status(409).json({ msg: 'No promocode found with that name'})
        }
        const response = await Promocodes.findOneAndDelete({name: name});
        return res.status(200).json({ msg: 'Promocode Successfully deleted !!'});
    }catch(err){
        console.log(err);
    }
}

// get deals
exports.getDeals = async (req, res) => {
    try{
        const response = await Deals.find();
        if(!response){
            return res.status(409).json({ msg: 'No deal found with that name'})
        }
        return res.status(200).json({response: response})
    }catch(err){
        console.log(err);
    }
}

//post deals
exports.postDeals = async (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const link = req.body.link;
    try{
        const currentDeal = await Deals.findOne({name: name});
        if(currentDeal){
            return res.status(409).json({ msg: 'Deal with this name already exists'});
        }
        const deal = new Deals({
            name: name,
            description: description,
            link: link
        })
        const response = await deal.save()
        return res.status(201).json({ msg: 'Deal Saved', response: response});
    }catch(err){
        console.log(err)
    }
}

//edit deals
exports.editDeals = async (req, res) => {
    const name = req.body.name;
    const newDescription = req.body.description;
    const newLink = req.body.link;
    try{
        const currentDeal = await Deals.findOne({name: name});
        if(!currentDeal){
            return res.status(409).json({msg : 'No deal found with that name'})
        }
        currentDeal.description = newDescription ? newDescription : currentDeal.description;
        currentDeal.link = newLink ? newLink : currentDeal.link;
        const response = await currentDeal.save();
        return res.status(201).json({ msg: 'Deal Saved Successfully', response: response})
    }catch(err){
        console.log(err)
    }
}

//delete deals
exports.deleteDeals = async (req, res) => {
    const name = req.body.name;
    try{
        const currentDeal = await Deals.findOne({name: name});
        if(!currentDeal){
            return res.status(409).json({ msg: 'No deal found with that name'})
        }
        const response = await Deals.findOneAndDelete({name: name});
        return res.status(200).json({ msg: 'Deal Successfully deleted !!'});
    }catch(err){
        console.log(err);
    }
}

exports.getBookings = async (req, res, next) => {

    try{
        const response = await Booking.find()
        if(!response){
            return res.status(409).json({ msg: 'You have not booked any service yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

exports.getUserCombos = async (req, res, next) => {

    try{
        const response = await UserMadeCombos.find()
        if(!response){
            return res.status(409).json({ msg: 'No combos have been made yet'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

exports.editUserCombos = async (req, res, next) => {
    const userMadeCombosId = req.query.userMadeCombosId;
    const newTotalAmount = req.body.totalAmount;
    try{
        const currentUserCombo = await UserMadeCombos.findOne({ _id: userMadeCombosId });
        if(!currentUserCombo){
            return res.status(409).json({ msg: 'No Combo found'})
        }
        currentUserCombo.totalAmount = newTotalAmount?newTotalAmount:currentUserCombo.totalAmount;
        const response = await currentUserCombo.save();
        return res.status(200).json(response)
    }
    catch(err){
        console.log(err);
    }
}

exports.getUsers = async (req, res, next) => {
    const id = req.query.id;
    try{
        const response = await User.findOne({ _id: id });
        if(!response){
            return res.status(409).json({ msg: 'No user found'})
        }

        return res.status(200).json(response);
    }
    catch(err){
        console.log(err);
    }
}

//add Emplyee
exports.addEmployee=async(req,res,next)=>{
    
     try{

        const employee=await Employee.findOne({mobileNumber:req.body.mobileNumber})
        if(employee){
            return res.status(409).json({ msg: "Employee already exists."});
        }
     const employeeFields={}
     if(req.body.name) employeeFields.name=req.body.name
     if(req.body.mobileNumber) employeeFields.mobileNumber=req.body.mobileNumber
   
    if( req.body.unmatchedSkills)
       employeeFields.unmatchedSkills=req.body.unmatchedSkills.split(',')
    
     if(req.body.LeaveDay) employeeFields.LeaveDay=req.body.LeaveDay
     if(req.body.LeaveDate) employeeFields.LeaveDate=req.body.LeaveDate
    

         employeeFields.Isavailable={}
         if(req.body.avlat_ten)employeeFields.Isavailable.avlat_ten=req.body.avlat_ten
         if(req.body.avltat_tenthity)employeeFields.Isavailable.avltat_tenthity=req.body.avltat_tenthity
         if(req.body.avlat_eleven)employeeFields.Isavailable.avlat_eleven=req.body.avlat_eleven
         if(req.body.avlat_eleventhirty)employeeFields.Isavailable.avlat_eleventhirty=req.body.avlat_eleventhirty
         if(req.body.avlat_twelve)employeeFields.Isavailable.avlat_twelve=req.body.avlat_twelve
         if(req.body.avlat_twelvethirty)employeeFields.Isavailable.avlat_twelvethirty=req.body.avlat_twelvethirty
         if(req.body.avlat_one)employeeFields.Isavailable.avlat_one=req.body.avlat_one
         if(req.body.avlat_onethirty)employeeFields.Isavailable.avlat_onethirty=req.body.avlat_onethirty
         if(req.body.avlat_two)employeeFields.Isavailable.avlat_two=req.body.avlat_two
         if(req.body.avlat_twothirty)employeeFields.Isavailable.avlat_twothirty=req.body.avlat_twothirty
         if(req.body.avlat_three)employeeFields.Isavailable.avlat_three=req.body.avlat_three
         if(req.body.avlat_threethirty)employeeFields.Isavailable.avlat_threethirty=req.body.avlat_threethirty
         if(req.body.avlat_four)employeeFields.Isavailable.avlat_four=req.body.avlat_four
         if(req.body.avlat_fourthirty)employeeFields.Isavailable.avlat_fourthirty=req.body.avlat_fourthirty
         if(req.body.avlat_five)employeeFields.Isavailable.avlat_five=req.body.avlat_five
         if(req.body.avlat_fivethirty)employeeFields.Isavailable.avlat_fivethirty=req.body.avlat_fivethirty
          
    employeeFields.address={}
    if(req.body.pincode)employeeFields.address.pincode=req.body.pincode
    if(req.body.locality)employeeFields.address.locality=req.body.locality
    if(req.body.district)employeeFields.address.district=req.body.district
    if(req.body.state)employeeFields.address.state=req.body.state
    const address=req.body.pincode+' '+req.body.locality+' '+req.body.district+' '+req.body.state
    const geocode_url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?type=place,postcode&access_token='+mapbox_token
   axios.get(geocode_url).then(async(value)=>{
      
        latitude=value.data.features[0].center[1]
        longitude=value.data.features[0].center[0]
        employeeFields.address.latitude=latitude
        employeeFields.address.longitude=longitude

        const newEmployee=new Employee(employeeFields)

         await newEmployee.save()
            res.json(newEmployee)
        
        
    }) .catch(err=>{
       res.json(err)
    })
  
     
     }
     catch(err){
       
         res.json(err)
     }

     
}

//get employee details

exports.getEmployee=async(req,res,next)=>{
    try{
            const employee=await Employee.findOne({mobileNumber:req.params.mobileNumber})
             if(!employee){
                 return res.json('No Employee Exist')
             }
            res.status(200).json(employee)
    }
    catch(err){
            res.status(404).json(err)
    }
}

//get all employees
exports.getAllEmployee=async(req,res,next)=>{
    try{
        
          const employees=await Employee.find()
          //console.log(employees)
          res.status(200).json(employees)
    }
    catch(err){
            res.status(409).json('some Error Occur')
    }
}

//Edit Employee
exports.editEmployee=async(req,res,next)=>{
    try{
        const employee=await Employee.findOne({mobileNumber:req.params.mobileNumber})
        if(!employee){
            return res.status(409).json({ msg: "Employee does not  exists."});
        }
       
     const employeeFields={}
     if(req.body.name) employeeFields.name=req.body.name
     if(req.body.mobileNumber) employeeFields.mobileNumber=req.body.mobileNumber
  
     if(req.body.LeaveDay) employeeFields.LeaveDay=req.body.LeaveDay
     if(req.body.LeaveDate) employeeFields.LeaveDate=req.body.LeaveDate
     if(req.body.unmatchedSkills)
          employeeFields.unmatchedSkills=req.body.unmatchedSkills.split(',')
 
        
      

         employeeFields.Isavailable={}
        
         req.body.avlat_ten?employeeFields.Isavailable.avlat_ten=req.body.avlat_ten:employeeFields.Isavailable.avlat_ten=employee.Isavailable.avlat_ten
         req.body.avltat_tenthity?employeeFields.Isavailable.avltat_tenthity=req.body.avltat_tenthity:employeeFields.Isavailable.avlat_tenthirty=employee.Isavailable.avlat_tenthirty
         req.body.avlat_eleven?employeeFields.Isavailable.avlat_eleven=req.body.avlat_eleven:employeeFields.Isavailable.avlat_eleven=employee.Isavailable.avlat_eleven
         req.body.avlat_eleventhirty?employeeFields.Isavailable.avlat_eleventhirty=req.body.avlat_eleventhirty:employeeFields.Isavailable.avlat_eleventhirty=employee.Isavailable.avlat_eleventhirty
         req.body.avlat_twelve?employeeFields.Isavailable.avlat_twelve=req.body.avlat_twelve:employeeFields.Isavailable.avlat_twelve=employee.Isavailable.avlat_twelve
         req.body.avlat_twelvethirty?employeeFields.Isavailable.avlat_twelvethirty=req.body.avlat_twelvethirty:employeeFields.Isavailable.avlat_twelvethirty=employee.Isavailable.avlat_twelvethirty
         req.body.avlat_one?employeeFields.Isavailable.avlat_one=req.body.avlat_one:employeeFields.Isavailable.avlat_one=employee.Isavailable.avlat_one
         req.body.avlat_onethirty?employeeFields.Isavailable.avlat_onethirty=req.body.avlat_onethirty:employeeFields.Isavailable.avlat_onethirty=employee.Isavailable.avlat_onethirty
         req.body.avlat_two?employeeFields.Isavailable.avlat_two=req.body.avlat_two:employeeFields.Isavailable.avlat_two=employee.Isavailable.avlat_two
         req.body.avlat_twothirty?employeeFields.Isavailable.avlat_twothirty=req.body.avlat_twothirty:employeeFields.Isavailable.avlat_twothirty=employee.Isavailable.avlat_twothirty
         req.body.avlat_three?employeeFields.Isavailable.avlat_three=req.body.avlat_three:employeeFields.Isavailable.avlat_three=employee.Isavailable.avlat_three
         req.body.avlat_threethirty?employeeFields.Isavailable.avlat_threethirty=req.body.avlat_threethirty:employeeFields.Isavailable.avlat_threethirty=employee.Isavailable.avlat_threethirty
         req.body.avlat_four?employeeFields.Isavailable.avlat_four=req.body.avlat_four:employeeFields.Isavailable.avlat_four=employee.Isavailable.avlat_four
         req.body.avlat_fourthirty?employeeFields.Isavailable.avlat_fourthirty=req.body.avlat_fourthirty:employeeFields.Isavailable.avlat_fourthirty=employee.Isavailable.avlat_fourthirty
         req.body.avlat_five?employeeFields.Isavailable.avlat_five=req.body.avlat_five:employeeFields.Isavailable.avlat_five=employee.Isavailable.avlat_five
         req.body.avlat_fivethirty?employeeFields.Isavailable.avlat_fivethirty=req.body.avlat_fivethirty:employeeFields.Isavailable.avlat_fivethirty=employee.Isavailable.avlat_fivethirty
         
         employeeFields.address={}
         if(req.body.pincode)employeeFields.address.pincode=req.body.pincode
         if(req.body.locality)employeeFields.address.locality=req.body.locality
         req.body.district?employeeFields.address.district=req.body.district:employeeFields.address.district=employee.address.district
         req.body.state?employeeFields.address.state=req.body.state:employeeFields.address.state=employee.address.state
         const address=employeeFields.address.pincode+' '+employeeFields.address.locality+' '+employeeFields.address.district+' '+employeeFields.address.state
        
          const geocode_url='https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?type=place,postcode&access_token='+mapbox_token
  
         axios.get(geocode_url).then(async (value)=>{
               
                latitude=value.data.features[0].center[1]
                longitude=value.data.features[0].center[0]
                
                employeeFields.address.latitude=latitude
                employeeFields.address.longitude=longitude


            const updatedEmployee= await Employee.findOneAndUpdate(
                {mobileNumber:req.params.mobileNumber},
                {$set:employeeFields},
                {new:true}
                )
                if(updatedEmployee)
                return res.json(updatedEmployee)
                else{
                    errors.update='Some error occur during update'
                    res.status(400).json(errors)
                }
         })
         .catch(err=>{
             res.json(err)
         })

  
       
     }
     catch(err){
         res.json(err)
     }
}


//delete Employee
exports.deleteEmployee=async(req,res,next)=>{
    try{
            const employee=await Employee.findOneAndRemove({mobileNumber:req.params.mobileNumber})
           if(!employee){
               return res.json('No Employee exist')
           }
            res.status(200).json(employee)
    }
    catch(err){
            res.status(404).json(err)
    }
}

//add Booking to employee

exports.addBooking=async (req,res,next)=>{
    try{
        
        const booking=req.body.booking
       
       const employee=await Employee.findOneAndUpdate(
                                      {mobileNumber:req.params.mobileNumber},
                                        {booking:booking},
                                         {new:true}
                                         )
       if(!employee){
           return res.status(409).json('No Employee Exist')
       }
            //console.log(employee)
           res.status(200).json(employee)
    }
    catch(err){
    //    console.log(err)
     res.status(409).json('No Employee Found')
    }
}