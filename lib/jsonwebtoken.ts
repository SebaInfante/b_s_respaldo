import jwt from 'jsonwebtoken'

export const generarJWT = ( uid:number ) =>{
    return new Promise ((resove,reject)=>{

        const secretKey = process.env.SECRETTOPRIVATEKEY!
        const payload = { uid }

        jwt.sign( payload, secretKey, { expiresIn:'4h' }, ( err , token ) => {
            if( err ){
                console.log( err );
                reject('No se pudo gener el token');
            } else { resove( token ) }
        })
    })
}

