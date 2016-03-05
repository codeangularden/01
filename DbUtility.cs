using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Driver;
using System.Configuration;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver.Builders;
using MongoDB.Bson.IO;

namespace EmployeeRegistration_ModelLess.DbUtilityDB
{
    public class DbUtility
    {
        protected MongoDatabase mongoDB { get; set; }
        public DbUtility()
        {
            var mongoClient = new MongoClient(Convert.ToString(ConfigurationManager.AppSettings["MongoDBServer"]));
            MongoServer Server = mongoClient.GetServer();
            mongoDB = Server.GetDatabase(Convert.ToString(ConfigurationManager.AppSettings["DBName"]));
        }
       
        public bool SaveDocument(string objectToSave, string collectionName)
        {                          
                var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
                var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
                collection.Insert(document);                          
                return true;
        }

        public bool SaveDocumentBsonArray(string objectToSave, string collectionName)
        {
            var collection = mongoDB.GetCollection<BsonArray>(collectionName);
            collection.RemoveAll();
            var document = BsonSerializer.Deserialize<BsonArray>(objectToSave);            
            collection.InsertBatch(document);
            return true;
        }
        public bool UpdateDocument(string objectToSave, string collectionName, string key, string value)
        {

            var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            collection.Update(
            Query.EQ(key, value),
            Update.Replace(document),
            UpdateFlags.Upsert);

            return true;
        }
        public bool UpdateDocumentByObjectId(string objectToSave, string collectionName)
        {

            var document = BsonSerializer.Deserialize<BsonDocument>(objectToSave);
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            collection.Save(document);
            return true;
        }
        public bool DeleteDocumentByObjectId(string collectionName,ObjectId id)
        {
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            var query = Query.EQ("_id", id);
            collection.Remove(query);
            return true;
        }
        public bool DeleteDocument(string collectionName,string key, string id)
        {
            var collection = mongoDB.GetCollection<BsonDocument>(collectionName);
            var query = Query.EQ(key, id);
            collection.Remove(query);
            return true;
        }
        public string GetAllDocuments(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            return collection.FindAllAs<BsonDocument>().SetFields(Fields.Exclude("_id")).ToJson();
        }
       

        public string GetAllDocumentsWithObjectId(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return collection.FindAllAs<BsonDocument>().ToJson(jsonSettings);
        }
        public string GetDocumentById(string collectionName, string key, string value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).SetFields(Fields.Exclude("_id")).ToJson(jsonSettings);
        }
        public string GetDocumentById(string collectionName, string key, ObjectId value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).SetFields(Fields.Exclude("_id")).ToJson(jsonSettings);
        }
        public string GetDocumentByIdWithObjectId(string collectionName, string key, string value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).ToJson(jsonSettings);
        }
        public string GetDocumentByIdWithObjectId(string collectionName, string key, ObjectId value)
        {
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = mongoDB.GetCollection(collectionName);
            var query = Query.EQ(key, value);
            return collection.FindAs<BsonDocument>(query).ToJson(jsonSettings);
        }
        public MongoCollection GetCollection(string collectionName)
        {
            return mongoDB.GetCollection(collectionName);
        }

        public long GetCountOfCollection(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);
            return collection.Count();
        }    
        public string GetMaxOfAttribute(string collectionName, string attributename)
        {
            var collection = mongoDB.GetCollection(collectionName);
            string max = "1";
            if (collection.FindAll().SetSortOrder(SortBy.Descending(attributename)).SetLimit(1).FirstOrDefault() != null)
            {
                max = collection.FindAll().SetSortOrder(SortBy.Descending(attributename)).SetLimit(1).FirstOrDefault().ToArray()[1].Value.ToString();
            }
            return max;
        }

        public string GetAllDocumentsWithObjectIdGroupBy(string collectionName)
        {
            var collection = mongoDB.GetCollection(collectionName);

            var group = new BsonDocument 
                { 
                    { "$group", 
                        new BsonDocument 
                            { 
                                { "_id", new BsonDocument 
                                             { 
                                                 { 
                                                     "name","$name"
                                                 } 
                                             } 
                                }, 
                                { 
                                    "Count", new BsonDocument 
                                                 { 
                                                     { 
                                                         "$sum", 1 
                                                     } 
                                                 } 
                                } 
                            } 
                  } 
                };

            var pipeline = new[] { group };
            var result = collection.Aggregate(pipeline);

            var matchingExamples = result.ResultDocuments
                .Select(x => x.ToBsonDocument())
                .ToList();
           
            List<BsonDocument> countlst = matchingExamples.ToList();

            string json = GetAllDocumentsWithObjectId("EmpDetails");

            var mbd = mongoDB.GetCollection(collectionName);
            List<BsonDocument> doclst = mbd.FindAllAs<BsonDocument>().ToList();


            foreach (var b in doclst)
            {

                foreach (BsonDocument c in countlst)
                {
                    var a = c["_id"].AsBsonDocument;

                    if (b["name"].AsString.Equals(a["name"].AsString))
                    {
                        b.Add("Count", c["Count"].AsNullableInt32);
                    }

                }

            }
            var jsonSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            return doclst.ToJson(jsonSettings);


            //return collection.FindAllAs<BsonDocument>().ToJson(jsonSettings);
        }



        #region Model Based Operations
        /// <summary>
        /// Save The Document, override the ToString() method in the model to provide the collection name
        /// </summary>
        /// <param name="objectToSave"></param>
        /// <returns></returns>
        public bool SaveCollection(object objectToSave)
        {
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(objectToSave);
            BsonDocument document = BsonDocument.Parse(jsonString);

            var collection = mongoDB.GetCollection(objectToSave.ToString());

            collection.Insert(objectToSave);
            return true;
        }

        public bool SaveCollection(object objectToSave, string collectionName)
        {
            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(objectToSave);
            BsonDocument document = BsonDocument.Parse(jsonString);

            var collection = mongoDB.GetCollection(collectionName);

            collection.Insert(objectToSave);
            return true;
        }

        public MongoCollection<T> GetAllDocuments<T>(string collectionName)
        {
            return mongoDB.GetCollection<T>(collectionName);
        }
        #endregion

        //#region StrictModel Based Operations
        //public List<Country> getAllCountry()
        //{
        //    List<Country> oList = new List<Country>();
        //    var collection = mongoDB.GetCollection<Country>("Country");
        //    foreach (Country country in collection.FindAll())
        //    {
        //        oList.Add(country);
        //    }
        //    return oList;
        //}

        //public List<State> getAllStates()
        //{
        //    List<State> oList = new List<State>();
        //    var collection = mongoDB.GetCollection<State>("State");
        //    foreach (State state in collection.FindAll())
        //    {
        //        oList.Add(state);
        //    }
        //    return oList;
        //}

        //public List<District> getAllDistricts()
        //{
        //    List<District> oList = new List<District>();
        //    var collection = mongoDB.GetCollection<District>("District");
        //    foreach (District district in collection.FindAll())
        //    {
        //        oList.Add(district);
        //    }
        //    return oList;
        //}

        //public void insert(Student stud)
        //{
        //    try
        //    {
        //        MongoCollection<Student> collection = mongoDB.GetCollection<Student>("Student");
        //        collection.Save(stud);
        //    }

        //    catch { };
        //}

        //public List<Student> getStudentList()
        //{
        //    List<Student> list = new List<Student>();
        //    var collection = mongoDB.GetCollection<Student>("Student");
        //    foreach (Student stud in collection.FindAll())
        //    {
        //        list.Add(stud);
        //    }
        //    return list;

        //}

        //public void DeleteStudent(Student StudentObj)
        //{
        //    MongoCollection<Student> collection = mongoDB.GetCollection<Student>("Student");
        //    IMongoQuery query = Query.EQ("_id", new ObjectId(StudentObj.Id));
        //    collection.Remove(query);
        //}

        //#endregion
    }
}