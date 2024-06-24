import http from "@/lib/http";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";


const account = '/accounts'
const accountApiRequest = {
  me: () => http.get<AccountResType>(`${account}/me`),
  sMe: (accessToken: string) =>
    http.get<AccountResType>(`${account}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>(`${account}/me`, body),
  changePassword: (body: ChangePasswordBodyType) =>
  http.put<AccountResType>(`${account}/change-password`, body),
  list: () => http.get<AccountListResType>(`${account}`),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>(account, body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`${account}/detail/${id}`, body),
  getEmployee: (id: number) =>
    http.get<AccountResType>(`${account}/detail/${id}`),
  deleteEmployee: (id: number) =>
    http.delete<AccountResType>(`${account}/detail/${id}`)
};

export default accountApiRequest;
