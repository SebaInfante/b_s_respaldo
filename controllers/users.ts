import { Response, Request } from "express";
import { encriptar } from "../lib/bcrypt";
import Document from "../models/Docuement";
import Employment from "../models/Employment";
import Employee_Group from "../models/Employee_Group";
import User from "../models/user";

// ************************************************************************************************************************
// !                                              VER TODOS LOS USUARIOS
// ************************************************************************************************************************
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER USUARIO MANDANTE
// ************************************************************************************************************************
export const getUserMandante = async (req: Request, res: Response) => {
  const users = await User.findAll({ where: { role: "USM" } });
  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO
// ************************************************************************************************************************
export const getUserEmpleado = async (req: Request, res: Response) => {
  const users = await User.findAll({ where: { role: "USC" } });
  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
export const getUserEmpleadoPorAdmin = async (req: Request, res: Response) => {
  const users = await User.findAll({
    where: { role: "USC" },
  });
  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
export const getUserEmpleadoPorMandanteYAdmin = async (
  req: Request,
  res: Response
) => {
  const userAuth = req.body.userAuth;
  let users;
  if (userAuth.role === "USM") {
    users = await User.findAll({where: { role: "USC", employee: userAuth.id },});
  } else {
    users = await User.findAll({where: { role: "USC" },});
  }

  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER USUARIO EMPLEADO POR MANDANTE
// ************************************************************************************************************************
export const getemploxmandanteAdmin = async (req: Request, res: Response) => {
  const mandante = req.body.mandante;
  const users = await User.findAll({
    where: { role: "USC", employee: mandante },
  });
  res.json(users);
};

// ************************************************************************************************************************
// !                                              VER SOLO UN USUARIO
// ************************************************************************************************************************
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  user
    ? res.json(user)
    : res.status(404).json({ msg: `User with id ${id} not found` });
};

// ************************************************************************************************************************
// !                                              CREAR UN NUEVO USUARIO
// ************************************************************************************************************************
export const createUser = async (req: Request, res: Response) => {

  const { name, email, password, role, employee = null } = req.body;
  try {
    const existsEmail = await User.findOne({ where: { email } }); //Buscar si existe un email
    if (existsEmail) {
      return res.status(401).json({ msg: "Email already used" });
    } // Si tal email existe ...
    const hashPassword = await encriptar(password); //Encriptar la password
    const newUser = {
      //Creo el nuevo usuario
      name,
      email,
      password: hashPassword,
      role,
      employee,
    };
    const user = User.build(newUser); //Cargo el nuevo usuario
    await user.save(); //Envío el usuario a la BD

    if(role ==='USC'){
      const existsUSC = await Employee_Group.findOne({ where: { name } }); //Buscar si existe un email
      if(!existsUSC){
      const x = await Employee_Group.count();
      const rgt = (x+1)*2
      const lft = rgt-1
      const sort_num = x+1

      const newEmployeeGroup={
        id: x,
        site_id:1,
        name,
        parent_id:0,
        sort_num,
        lft,
        rgt,
        create_user: 'system'
      }


        const employee_group = Employee_Group.build(newEmployeeGroup); //Cargo el nuevo usuario
        await employee_group.save(); //Envío el usuario a la BD
      }
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact the administrator" });
  }
};

// ************************************************************************************************************************
// !                                              CREAR UN NUEVA OCUPACION
// ************************************************************************************************************************
export const createEmployement = async (req: Request, res: Response) => {
  const { mandante, employee, employment } = req.body;
  try {

    const employeeGroup = await Employee_Group.findOne({ where: { name: employee } });

    const newEmployement = {
      mandante,
      employee : employeeGroup.id,
      employment,
    };

    const employmentM = Employment.build(newEmployement);
    await employmentM.save();
    res.json(employmentM);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact the administrator" });
  }
};
// ************************************************************************************************************************
// !                                              CREAR UN NUEVO DOCUMENTO
// ************************************************************************************************************************
export const createDocument = async (req: Request, res: Response) => {
  const { id_employment, name } = req.body;
  try {
    const newDocument = {
      id_employment,
      name,
    };

    const DocumentM = Document.build(newDocument);
    await DocumentM.save();
    res.json(DocumentM);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact the administrator" });
  }
};

// ************************************************************************************************************************
// !                                              ACTUALIZAR UN USUARIO
// ************************************************************************************************************************
export const putUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (body.email) {
      const existsEmail = await User.findOne({ where: { email: body.email } });
      if (existsEmail) {
        return res.status(400).json({ msg: "Email already used" });
      }
    }
    await user.update(body);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Contact the administrator" });
  }
};

// ************************************************************************************************************************
// !                                              ELIMINAR UN USUARIO
// ************************************************************************************************************************
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  await user.update({ status: false }); // Eliminación Logica   //await user.destroy(); Eliminación Fisica
  res.json(user);
};
