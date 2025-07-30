
import { getAuthCookie } from "@/app/actions/cookies";
import { verifyToken } from "@/app/actions/auth";

export default async function dashboardPage() {

  const payload = await getAuthCookie();
    const verifss = await verifyToken(payload);
    console.log(verifss);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>You're Login!</p>
    </div>
    
  );
}