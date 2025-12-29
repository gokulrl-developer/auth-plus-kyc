import { User } from "../../models/user.model";
import { GetDashboardRequest, UserList } from "../../types/user.types";

export const getUserDashboard = async (
  getDashboardReq: GetDashboardRequest
): Promise<{userList:UserList[],totalPages:number}> => {
  const { page, pageSize, search } = getDashboardReq;
  const skip = (page - 1) * pageSize;
  const searchFilter = search
    ? { email: { $regex: search, $options: "i" } }
    : {};
  const userListDocs = await User.find(
    { ...searchFilter },
    { _id: 1, email: 1, createdAt: 1 }
  )
    .skip(skip)
    .limit(pageSize);
  const totalDocs =await User.countDocuments(
     { ...searchFilter }
  );
  const temp=totalDocs/pageSize
  const totalPages=Math.floor(temp)+1;
  const userList = userListDocs.map((doc) => {
    let user = doc.toObject();
    return {
      userId: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
    };
  });

  return {userList,totalPages};
};
