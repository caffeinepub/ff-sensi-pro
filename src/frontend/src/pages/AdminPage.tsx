import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type LocalPaymentRequest,
  type LocalUser,
  createUser,
  deleteUser,
  getPaymentRequests,
  getUsers,
  updateRequestStatus,
} from "@/utils/localBackend";
import { Lock, PlusCircle, Shield, Trash2, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_USER = "zeeshan18";
const ADMIN_PASS = "788";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [requests, setRequests] = useState<LocalPaymentRequest[]>([]);
  const [users, setUsers] = useState<LocalUser[]>([]);

  // Create user form
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPack, setNewPack] = useState("1");

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loginUser === ADMIN_USER && loginPass === ADMIN_PASS) {
      setAuthed(true);
      setRequests(getPaymentRequests());
      setUsers(getUsers());
    } else {
      setLoginErr("Invalid admin credentials");
    }
  }

  function handleApprove(id: string) {
    updateRequestStatus(id, "approved");
    setRequests(getPaymentRequests());
    toast.success("Request approved");
  }

  function handleReject(id: string) {
    updateRequestStatus(id, "rejected");
    setRequests(getPaymentRequests());
    toast.success("Request rejected");
  }

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      toast.error("Fill in all fields");
      return;
    }
    const ok = createUser(
      newUsername.trim(),
      newPassword.trim(),
      Number(newPack),
    );
    if (!ok) {
      toast.error("Username already exists");
      return;
    }
    toast.success(`User ${newUsername} created!`);
    setNewUsername("");
    setNewPassword("");
    setNewPack("1");
    setUsers(getUsers());
  }

  function handleDeleteUser(username: string) {
    deleteUser(username);
    setUsers(getUsers());
    toast.success(`User ${username} deleted`);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display font-800 text-2xl">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">
              FF Sensi Pro Management
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-user">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-user"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      placeholder="Admin username"
                      className="pl-9"
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-pass">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="admin-pass"
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Admin password"
                      className="pl-9"
                      required
                      data-ocid="admin.input"
                    />
                  </div>
                </div>
                {loginErr && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="admin.error_state"
                  >
                    {loginErr}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                  data-ocid="admin.submit_button"
                >
                  Login to Admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="font-display font-800 text-2xl">Admin Panel</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAuthed(false)}
            data-ocid="admin.button"
          >
            Logout
          </Button>
        </motion.div>

        <Tabs defaultValue="requests">
          <TabsList className="mb-6">
            <TabsTrigger value="requests" data-ocid="admin.tab">
              Payment Requests
            </TabsTrigger>
            <TabsTrigger value="users" data-ocid="admin.tab">
              Users
            </TabsTrigger>
          </TabsList>

          {/* Payment Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Payment Requests</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRequests(getPaymentRequests())}
                  data-ocid="admin.secondary_button"
                >
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No payment requests yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Pack</TableHead>
                          <TableHead>UPI Txn ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((req, i) => (
                          <TableRow
                            key={req.id}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-medium">
                              {req.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">Pack {req.pack}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {req.upiTxnId}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  req.status === "approved"
                                    ? "bg-green-700 text-white"
                                    : req.status === "rejected"
                                      ? "bg-destructive text-destructive-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                }
                              >
                                {req.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {req.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-primary text-primary-foreground h-7 text-xs"
                                    onClick={() => handleApprove(req.id)}
                                    data-ocid={`admin.primary_button.${i + 1}`}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 text-xs"
                                    onClick={() => handleReject(req.id)}
                                    data-ocid={`admin.delete_button.${i + 1}`}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create User Form */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    Create User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. player123"
                        required
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Set a password"
                        required
                        data-ocid="admin.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pack Level</Label>
                      <Select value={newPack} onValueChange={setNewPack}>
                        <SelectTrigger data-ocid="admin.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            Pack 1 – Basic (₹50)
                          </SelectItem>
                          <SelectItem value="2">Pack 2 – Pro (₹250)</SelectItem>
                          <SelectItem value="3">
                            Pack 3 – Elite (₹500)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground"
                      data-ocid="admin.submit_button"
                    >
                      Create User
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">All Users</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUsers(getUsers())}
                    data-ocid="admin.secondary_button"
                  >
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground"
                      data-ocid="admin.empty_state"
                    >
                      No users yet
                    </div>
                  ) : (
                    <Table data-ocid="admin.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Pack</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u, i) => (
                          <TableRow
                            key={u.username}
                            data-ocid={`admin.row.${i + 1}`}
                          >
                            <TableCell className="font-medium">
                              {u.username}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  u.pack === 3
                                    ? "border-[oklch(0.82_0.17_85/0.5)] text-[oklch(0.82_0.17_85)]"
                                    : u.pack === 2
                                      ? "border-accent/40 text-accent"
                                      : "border-primary/40 text-primary"
                                }
                              >
                                Pack {u.pack}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 text-xs"
                                onClick={() => handleDeleteUser(u.username)}
                                data-ocid={`admin.delete_button.${i + 1}`}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
