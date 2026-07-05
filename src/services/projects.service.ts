import prisma from "../config/prisma";
import { CreateProjectDto, UpdateProjectDto, ProjectPublic, } from "../types/projects.types";

export const projectsService = {
  // Lista todos los proyectos con el conteo de tareas de cada uno
  async findAll() {
    // 1. Consultar todos los proyectos ordenados por fecha de creación descendente
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        // _count agrega un campo con el número de registros relacionados
        // Es mucho más eficiente que cargar todas las tareas
        _count: { select: { tasks: true } },
      },
    });
  },
  
  // Obtiene un proyecto con su dueño y el conteo de tareas
  async findById(id: string) {
    // 1. Buscar proyecto por ID incluyendo el owner y el conteo de tareas
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true } },
      },
    });
  },
  
  // Crea un nuevo proyecto asignado al owner indicado
  async create(data: CreateProjectDto): Promise<ProjectPublic> {
    // 1. Insertar el proyecto con los datos recibidos
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      },
    });
  },
  
  // Actualiza los campos de un proyecto existente (name, description)
  async update(id: string, data: UpdateProjectDto): Promise<ProjectPublic> {
    // 1. Actualizar el proyecto que coincida con el ID usando los campos enviados
    return prisma.project.update({
      where: { id },
      data,
    });
  },
  
  // Elimina un proyecto por su ID. Las tareas asociadas se eliminan en cascada (configuración DB).
  async remove(id: string): Promise<void> {
    // 1. Eliminar el proyecto por ID (las tareas se borran en cascada)
    await prisma.project.delete({ where: { id } });
  },
};
