import server from './sever';
import colors from 'colors';
// console.log(express); => log all functions available in express framework. 
// console.log('Hola mundo desde Devtree'); => log message
const port = process.env.PORT || 4000;


server.listen(port, () => {
    console.log(colors.bgCyan.magenta(`Servidor Funcionando en el puerto: ${port}`));
}) 