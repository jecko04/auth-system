
import { getAuthCookie } from "@/app/actions/cookies";
import { verifyToken } from "@/app/actions/auth";

export default async function adminDashboardPage() {
  const session = await getAuthCookie();
  
  const payload = await getAuthCookie();
  const verifss = await verifyToken(payload);
  console.log(verifss);


  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>You're Login!</p>
      <pre>{JSON.stringify(session, null)}</pre>
    </div>
    
  );
}