import ServiceUserList from "@/features/dashbord/newServiceUser/ServiceUserList";
import ServiceUsersTable from "@/features/dashbord/serviceUser/ServiceUserTable";

export default function ServicePage() {
  return (
    <div className="space-y-6">
      
      {/* <ServiceUsersTable /> */}

      {/* Service User Table */}
      <ServiceUserList />

    </div>
  );
}