if(process.env.NODE_ENV === "production")
{
    module.exports ={
    //mongooooooooo
    mongoURI:"mongodb+srv://Jack:sbobsp@cluster0-bunro.mongodb.net/test?retryWrites=true&w=majority"
    }
}
else
{
    module.exports ={
        mongoURI:"mongodb://localhost:27017/gamelibrary"
    }
}