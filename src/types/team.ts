export interface CreateTeamDTO {
  name: string;
}

export interface AddMemberDTO {
  userId: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
}

export interface TeamResponse {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberResponse {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
