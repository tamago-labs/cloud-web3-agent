import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>({
    authMode: "userPool"
});

// User Profile API functions
export const userProfileAPI = {
    // Get user profile by ID  
    async getProfile(username: string) {
        try {

            let entry

            const user = await client.models.User.list({
                filter: {
                    username: {
                        eq: username
                    }
                }
            })

            if (user.data.length === 0) {
                const data = this.createProfile({
                    username,
                    displayName: "New User",
                    credits: 25,
                    creditsUsed: 0,
                    totalCredits: 25
                })

                entry = data
            } else {
                entry = user.data[0]
            }
            return entry
        } catch (error) {
            console.log(error)
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    // Update user profile  
    async updateProfile(userId: string, profileData: {
        displayName?: string;
    }) {
        try {

            const response = await client.models.User.update({
                id: userId,
                ...profileData
            });
            const { data: updatedProfile } = response
            return updatedProfile;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },
    // Create user profile  
    async createProfile(profileData: {
        username: string;
        displayName?: string;
        credits?: number;
        creditsUsed?: number;
        totalCredits?: number;
    }) {
        try {
            const { data: newProfile } = await client.models.User.create(profileData);
            return newProfile;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }
};

// Server API functions
export const serverAPI = {
    // Get all servers
    async getAllServers() {
        try {
            const { data: servers } = await client.models.Servers.list();
            return servers;
        } catch (error) {
            console.error('Error fetching all servers:', error);
            throw error;
        }
    },

}

// Project API functions
// export const projectAPI = {
//     // Get projects created by user  
//     async getUserProjects(userProfileId: string) {
//         try {
//             const { data: projects } = await client.models.Project.list({
//                 filter: { userProfileId: { eq: userProfileId } }
//             });
//             return projects;
//         } catch (error) {
//             console.error('Error fetching user projects:', error);
//             throw error;
//         }
//     },
//     // Get all projects for investment portfolio 
//     async getAllProjects() {
//         try {
//             const { data: projects } = await client.models.Project.list();
//             return projects;
//         } catch (error) {
//             console.error('Error fetching all projects:', error);
//             throw error;
//         }
//     },
//     // Get project by ID  
//     async getProject(projectId: string) {
//         try {
//             const { data: project } = await client.models.Project.get({ id: projectId });
//             return project;
//         } catch (error) {
//             console.error('Error fetching project:', error);
//             throw error;
//         }
//     },
//     // Create new project  
//     async createProject(projectData: any) {
//         try {
//             const { data: newProject } = await client.models.Project.create(projectData);
//             return newProject;
//         } catch (error) {
//             console.error('Error creating project:', error);
//             throw error;
//         }
//     },
//     // Update project 
//     async updateProject(projectId: string, projectData: any) {
//         try {
//             const { data: updatedProject } = await client.models.Project.update({
//                 id: projectId, ...projectData
//             }); return updatedProject;
//         } catch (error) { console.error('Error updating project:', error); throw error; }
//     }
// };
