using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EmployeeRegistration_ModelLess.DbUtilityDB;
using System.Web.Services;
using System.Web.Script.Services;
using MongoDB.Bson;

namespace EmployeeRegistration_ModelLess.View
{
    public partial class EmployeeRegistration : System.Web.UI.Page
    {
        #region Private variables

        static DbUtility oDAL = new DbUtility();
        static string returnString = String.Empty;

        #endregion

        #region WebMethods

        [WebMethod]
        public static bool SaveEmployee(string empObj)
        {
            return oDAL.SaveDocument(empObj, "EmpDetails");
            
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static string GetAllEmployees()
        {
            //return oDAL.GetAllDocumentsWithObjectId("EmpDetails");
            return oDAL.GetAllDocumentsWithObjectIdGroupBy("EmpDetails");
        }

        [WebMethod]
        public static bool DeleteEmployee(string empid)
        {
            return oDAL.DeleteDocumentByObjectId("EmpDetails", ObjectId.Parse(empid));
        }
        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static string GetAllReligions()
        {
            return oDAL.GetAllDocumentsWithObjectId("Religion");
        }
        [WebMethod]
        public static bool EditEmployee(string empObj)
        {
            return oDAL.UpdateDocumentByObjectId(empObj, "EmpDetails");
        }
        [WebMethod]
        public static bool SaveEmployeeToCloud(string empObj)
        {
            return oDAL.SaveDocumentBsonArray(empObj, "EmpDetails");
        }
        #endregion

    }
}