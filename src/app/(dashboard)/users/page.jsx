"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/superbase/client"
import UsersTable from "@/components/dashboard/UsersTable";

export default function UsersPage() {

  const [users,setUsers] = useState([])

  async function fetchUsers(){

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at",{ascending:false})

    if(error){
      console.error(error)
      return
    }

    setUsers(data)
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  return (
    <div className="space-y-6">
      
    <UsersTable />

    {/* {users.map(user => (
        <UsersTable
          key={user.id}
          user={user}
          refresh={fetchUsers}
        />
      ))} */}

    </div>
  );
}