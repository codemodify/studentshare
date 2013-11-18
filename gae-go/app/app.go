package app

import (
	"encoding/json"
    "encoding/base64"
    "log"
    "time"
    "appengine"
    "appengine/datastore"

    "go-restful"
    "gouuid"
)

// github.com/Moddus/go-restful
// github.com/nu7hatch/gouuid

type User struct {
	Id string
	Name string
	Pass string
	Email string
}
type Chat struct {
    Id string
    OwnerId string
    Message string
    When time.Time
    WhenAsString string
}
type Borrow struct {
    Id string
    OwnerId string
    Type string
    Phone string
    Email string
    Description string
    Price string
	WantCount int
}
type Sell struct {
    Id string
    OwnerId string
    Type string
    Phone string
    Email string
    Description string
    Price string
    WantCount int
}
type Search struct {
    Id string
    OwnerId string
    Type string
    Phone string
    Email string
    Description string
    Price string
    WantCount int
}
type BorrowWant struct {
	Id string
	ItemId string
	UserId string
}
type SellWant struct {
	Id string
	ItemId string
	UserId string
}
type SearchWant struct {
	Id string
	ItemId string
	UserId string
}

func GetAllUsers(request *restful.Request, response *restful.Response) {

    context := appengine.NewContext(request.Request)

    var userList []User
    query := datastore.NewQuery("User")
    for record := query.Run(context); ; {
        
        var data User
        _, err := record.Next(&data)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("GetAllUsers_ERROR: %v", err)
            return
        }

        userList = append(userList, data)
    }

    bytes, _ := json.Marshal(userList)

    response.Write(bytes)
}


// Response Helpers
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func SendNull(response *restful.Response) {
    bytes, _ := json.Marshal(nil)
    response.Write(bytes)
}
func SendBool(response *restful.Response, data bool) {
    bytes, _ := json.Marshal(data)
    response.Write(bytes)
}
func SendString(response *restful.Response, data string) {
    bytes, _ := json.Marshal(data)
    response.Write(bytes)
}
func SendInt(response *restful.Response, data int) {
    bytes, _ := json.Marshal(data)
    response.Write(bytes)
}
func SendUser(response *restful.Response, data User) {
    bytes, _ := json.Marshal(data)
    response.Write(bytes)
}


// Datastore Helpers
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func defaultKey(c appengine.Context, keyName string) *datastore.Key {
        return datastore.NewKey(c, keyName, "default", 0, nil)
}
func (t *User) key(c appengine.Context) *datastore.Key {
    table := "User"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *Chat) key(c appengine.Context) *datastore.Key {
    table := "Chat"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *Borrow) key(c appengine.Context) *datastore.Key {
    table := "Borrow"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *Sell) key(c appengine.Context) *datastore.Key {
    table := "Sell"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *Search) key(c appengine.Context) *datastore.Key {
    table := "Search"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *BorrowWant) key(c appengine.Context) *datastore.Key {
    table := "BorrowWant"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *SellWant) key(c appengine.Context) *datastore.Key {
    table := "SellWant"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}
func (t *SearchWant) key(c appengine.Context) *datastore.Key {
    table := "SearchWant"
    if t.Id == "" {
        return datastore.NewIncompleteKey(c, table, defaultKey(c,table))
    }
    return datastore.NewKey(c, table, t.Id, 0, defaultKey(c,table))
}


// Entry Point
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func init() {

    log.Printf("%s", time.Now())

    wsA := new(restful.WebService)
	wsA.Path("/GetAllUsers").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	wsA.Route(wsA.GET("/").To(GetAllUsers))
	restful.Add(wsA)

    // Auth
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws01 := new(restful.WebService)
	ws01.Path("/RegisterUser").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws01.Route(ws01.GET("/{Name}/{Pass}").To(ServiceHandlers_RegisterUser)).
         Param(ws01.PathParameter("Name", "").DataType("string")).
         Param(ws01.PathParameter("Pass", "").DataType("string"))
	restful.Add(ws01)

    ws02 := new(restful.WebService)
	ws02.Path("/LoginUser").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws02.Route(ws02.GET("/{Name}/{Pass}").To(ServiceHandlers_LoginUser)).
         Param(ws02.PathParameter("Name", "").DataType("string")).
         Param(ws02.PathParameter("Pass", "").DataType("string"))
	restful.Add(ws02)

    ws03 := new(restful.WebService)
	ws03.Path("/UpdateUserProfile").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws03.Route(ws03.GET("/{UserId}/{Email}").To(ServiceHandlers_UpdateUserProfile)).
         Param(ws03.PathParameter("UserId", "").DataType("string")).
         Param(ws03.PathParameter("Email", "").DataType("string"))
	restful.Add(ws03)

    // Chat
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws04 := new(restful.WebService)
	ws04.Path("/ChatSendMessage").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws04.Route(ws04.GET("/{UserId}/{Message}").To(ServiceHandlers_ChatSendMessage)).
         Param(ws04.PathParameter("UserId", "").DataType("string")).
         Param(ws04.PathParameter("Message", "").DataType("string"))
	restful.Add(ws04)

    ws05 := new(restful.WebService)
	ws05.Path("/ChatGetMessages").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws05.Route(ws05.GET("/{UserId}/{LastMessageId}").To(ServiceHandlers_ChatGetMessages)).
         Param(ws05.PathParameter("UserId", "").DataType("string")).
         Param(ws05.PathParameter("LastMessageId", "").DataType("string"))
	restful.Add(ws05)

    // Add
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws06 := new(restful.WebService)
	ws06.Path("/AddBorrow").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws06.Route(ws06.GET("/{UserId}/{Type}/{Phone}/{Email}/{Description}/{Price}").To(ServiceHandlers_AddBorrow)).
         Param(ws06.PathParameter("UserId", "").DataType("string")).
         Param(ws06.PathParameter("Type", "").DataType("string")).
         Param(ws06.PathParameter("Phone", "").DataType("string")).
         Param(ws06.PathParameter("Email", "").DataType("string")).
         Param(ws06.PathParameter("Description", "").DataType("string")).
         Param(ws06.PathParameter("Price", "").DataType("string"))
	restful.Add(ws06)

    ws07 := new(restful.WebService)
	ws07.Path("/AddSell").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws07.Route(ws07.GET("/{UserId}/{Type}/{Phone}/{Email}/{Description}/{Price}").To(ServiceHandlers_AddSell)).
         Param(ws07.PathParameter("UserId", "").DataType("string")).
         Param(ws07.PathParameter("Type", "").DataType("string")).
         Param(ws07.PathParameter("Phone", "").DataType("string")).
         Param(ws07.PathParameter("Email", "").DataType("string")).
         Param(ws07.PathParameter("Description", "").DataType("string")).
         Param(ws07.PathParameter("Price", "").DataType("string"))
	restful.Add(ws07)

    ws08 := new(restful.WebService)
	ws08.Path("/AddSearch").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws08.Route(ws08.GET("/{UserId}/{Type}/{Phone}/{Email}/{Description}/{Price}").To(ServiceHandlers_AddSearch)).
         Param(ws08.PathParameter("UserId", "").DataType("string")).
         Param(ws08.PathParameter("Type", "").DataType("string")).
         Param(ws08.PathParameter("Phone", "").DataType("string")).
         Param(ws08.PathParameter("Email", "").DataType("string")).
         Param(ws08.PathParameter("Description", "").DataType("string")).
         Param(ws08.PathParameter("Price", "").DataType("string"))
	restful.Add(ws08)

    // Remove
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws09 := new(restful.WebService)
	ws09.Path("/RemoveBorrow").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws09.Route(ws09.GET("/{ItemId}/{OwnerId}").To(ServiceHandlers_RemoveBorrow)).
         Param(ws09.PathParameter("ItemId", "").DataType("string")).
         Param(ws09.PathParameter("OwnerId", "").DataType("string"))
	restful.Add(ws09)

    ws10 := new(restful.WebService)
	ws10.Path("/RemoveSell").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws10.Route(ws10.GET("/{ItemId}/{OwnerId}").To(ServiceHandlers_RemoveSell)).
       Param(ws10.PathParameter("ItemId", "").DataType("string")).
       Param(ws10.PathParameter("OwnerId", "").DataType("string"))
	restful.Add(ws10)

    ws11 := new(restful.WebService)
	ws11.Path("/RemoveSearch").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws11.Route(ws11.GET("/{ItemId}/{OwnerId}").To(ServiceHandlers_RemoveSearch)).
       Param(ws11.PathParameter("ItemId", "").DataType("string")).
       Param(ws11.PathParameter("OwnerId", "").DataType("string"))
	restful.Add(ws11)

    // Load
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws12 := new(restful.WebService)
	ws12.Path("/LoadSell").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws12.Route(ws12.GET("/{UserId}").To(ServiceHandlers_LoadSell)).
       Param(ws12.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws12)

    ws13 := new(restful.WebService)
	ws13.Path("/LoadSearch").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws13.Route(ws13.GET("/{UserId}").To(ServiceHandlers_LoadSearch)).
       Param(ws13.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws13)

    ws14 := new(restful.WebService)
	ws14.Path("/LoadBorrow").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws14.Route(ws14.GET("/{UserId}").To(ServiceHandlers_LoadBorrow)).
       Param(ws14.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws14)

    // Want
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws15 := new(restful.WebService)
	ws15.Path("/WantBorrow").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws15.Route(ws15.GET("/{ItemId}/{UserId}").To(ServiceHandlers_WantBorrow)).
       Param(ws15.PathParameter("ItemId", "").DataType("string")).
       Param(ws15.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws15)

    ws16 := new(restful.WebService)
	ws16.Path("/WantSell").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws16.Route(ws16.GET("/{ItemId}/{UserId}").To(ServiceHandlers_WantSell)).
       Param(ws16.PathParameter("ItemId", "").DataType("string")).
       Param(ws16.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws16)

    ws17 := new(restful.WebService)
	ws17.Path("/WantSearch").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws17.Route(ws17.GET("/{ItemId}/{UserId}").To(ServiceHandlers_WantSearch)).
       Param(ws17.PathParameter("ItemId", "").DataType("string")).
       Param(ws17.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws17)

    // Info
    // ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
    ws18 := new(restful.WebService)
	ws18.Path("/GetInterestedUsers").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws18.Route(ws18.GET("/{UserId}").To(ServiceHandlers_GetInterestedUsers)).
       Param(ws18.PathParameter("UserId", "").DataType("string"))
	restful.Add(ws18)

    ws19 := new(restful.WebService)
	ws19.Path("/GetInterestedUsersToBorrow").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws19.Route(ws19.GET("/{ItemId}").To(ServiceHandlers_GetInterestedUsersToBorrow)).
       Param(ws19.PathParameter("ItemId", "").DataType("string"))
	restful.Add(ws19)

    ws20 := new(restful.WebService)
	ws20.Path("/GetInterestedUsersToSell").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws20.Route(ws20.GET("/{ItemId}").To(ServiceHandlers_GetInterestedUsersToSell)).
       Param(ws20.PathParameter("ItemId", "").DataType("string"))
	restful.Add(ws20)

    ws21 := new(restful.WebService)
	ws21.Path("/GetInterestedUsersToSearch").Consumes(restful.MIME_JSON).Produces(restful.MIME_JSON)
	ws21.Route(ws21.GET("/{ItemId}").To(ServiceHandlers_GetInterestedUsersToSearch)).
       Param(ws21.PathParameter("ItemId", "").DataType("string"))
	restful.Add(ws21)
}

// Auth
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_RegisterUser(request *restful.Request, response *restful.Response) {

    // Input
    Name := request.PathParameter("Name")
    Pass := request.PathParameter("Pass")

    // Search for exisiting user
    context := appengine.NewContext(request.Request)
    querySize := 1
    query := datastore.NewQuery("User").Filter("Name =", Name).Limit(querySize)
    queryResult := make([]User, 0, querySize)
    if _, err := query.GetAll(context, &queryResult); err != nil {
        log.Printf("ServiceHandlers_RegisterUser -> 264 -> APP_ERROR: %s", err.Error())
        SendString(response, "")
        return
    }
    
    // Store new user
    if len(queryResult) != 0 {
        SendString(response, "exists")
    } else {

        id, _ := uuid.NewV4()

        user := User {
            Id:     id.String(),
            Name:   Name,
            Pass:   Pass,
            Email:  "",
        }

        _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "User", nil), &user)
        if err != nil {
            log.Printf("APP_ERROR: %s", err.Error())
            SendString(response, "")
            return
        }
        
        SendString(response, id.String())
    }
}
func ServiceHandlers_LoginUser(request *restful.Request, response *restful.Response) {

    // Input
    Name := request.PathParameter("Name")
    Pass := request.PathParameter("Pass")

    // Search for exisiting user
    context := appengine.NewContext(request.Request)
    querySize := 1
    query := datastore.NewQuery("User").Filter("Name =", Name).Filter("Pass =", Pass).Limit(querySize)
    queryResult := make([]User, 0, querySize)
    if _, err := query.GetAll(context, &queryResult); err != nil {
        log.Printf("ServiceHandlers_LoginUser -> 325 -> APP_ERROR: %s", err.Error())
        SendNull(response)
        return
    }

    // Send user
    if len(queryResult) == 0 {
        SendNull(response)
    } else {
        SendUser(response, queryResult[0])
    }
}
func ServiceHandlers_UpdateUserProfile(request *restful.Request, response *restful.Response) {

    // Input
    UserId := request.PathParameter("UserId")
    Email := request.PathParameter("Email")

    decodedEmail, _ := base64.StdEncoding.DecodeString(Email)

    context := appengine.NewContext(request.Request)

    query := datastore.NewQuery("User").Filter("Id =", UserId)
    for record := query.Run(context); ; {

        var data User
        key, err := record.Next(&data)

        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("GetAllUsers_ERROR: %v", err)
            return
        }

        if data.Id == UserId {
            data.Email = string(decodedEmail)
            datastore.Put(context, key, &data)

            SendBool(response, true)
            return
        }
    }

    SendBool(response, false)
    return
}


// Chat
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_ChatSendMessage(request *restful.Request, response *restful.Response) {
    // Input
    UserId := request.PathParameter("UserId")
    Message := request.PathParameter("Message")

    context := appengine.NewContext(request.Request)
    querySize := 1

    // Search for valid user
    query := datastore.NewQuery("User").Filter("Id =", UserId).Limit(querySize)
    queryResult := make([]User, 0, querySize)
    query.GetAll(context, &queryResult)

    if len(queryResult) > 0 {
        id, _ := uuid.NewV4()

        decodedMessage, _ := base64.StdEncoding.DecodeString(Message)

        chat := Chat {
            Id:     id.String(),
            OwnerId: UserId,
            Message: string(decodedMessage),
            When: time.Now(),
        }

        _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "Chat", nil), &chat)
        if err != nil {
            log.Printf("APP_ERROR: %s", err.Error())
            SendString(response, "")
            return
        }
    }

    SendString(response, "")
}
func ServiceHandlers_ChatGetMessages(request *restful.Request, response *restful.Response) {

    // Input
    //UserId := request.PathParameter("UserId")
    //LastMessageId := request.PathParameter("LastMessageId")

    // Search
    context := appengine.NewContext(request.Request)
    querySize1 := 100

    query1 := datastore.NewQuery("Chat").Order("When").Limit(querySize1)
    queryResult1 := make([]Chat, 0, querySize1)
    query1.GetAll(context, &queryResult1)

    querySize2 := 5000
    query2 := datastore.NewQuery("User").Limit(querySize2)
    queryResult2 := make([]User, 0, querySize2)
    query2.GetAll(context, &queryResult2)

    m := make(map[string]string)
    for i := 0; i < len(queryResult2); i++ {
        m[queryResult2[i].Id] = queryResult2[i].Name
    }

    for j := 0; j < len(queryResult1); j++ {
        queryResult1[j].OwnerId = m[queryResult1[j].OwnerId]
        queryResult1[j].WhenAsString = queryResult1[j].When.Format("2006/01/02 03:04:05")
    }

    // Output
    bytes, _ := json.Marshal(queryResult1)
    response.Write(bytes)
}


// Add
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_AddBorrow(request *restful.Request, response *restful.Response) {

    // Input
    UserId := request.PathParameter("UserId")
    Type := request.PathParameter("Type")
    Phone := request.PathParameter("Phone")
    Email := request.PathParameter("Email")
    Description := request.PathParameter("Description")
    Price := request.PathParameter("Price")

	decodedType, _ := base64.StdEncoding.DecodeString(Type)
	decodedPhone, _ := base64.StdEncoding.DecodeString(Phone)
	decodedEmail, _ := base64.StdEncoding.DecodeString(Email)
	decodedDescription, _ := base64.StdEncoding.DecodeString(Description)
	decodedPrice, _ := base64.StdEncoding.DecodeString(Price)

    // Add
    context := appengine.NewContext(request.Request)

    id, _ := uuid.NewV4()

    borrow := Borrow {
        Id:             id.String(),
        OwnerId:        UserId,
        Type:           string(decodedType),
        Phone:          string(decodedPhone),
        Email:          string(decodedEmail),
        Description:    string(decodedDescription),
        Price:          string(decodedPrice),
	    WantCount:      0,
    }

    _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "Borrow", nil), &borrow)
    if err != nil {
        log.Printf("APP_ERROR: %s", err.Error())
        SendString(response, "")
        return
    }

    SendString(response, id.String())
}
func ServiceHandlers_AddSell(request *restful.Request, response *restful.Response) {

    // Input
    UserId := request.PathParameter("UserId")
    Type := request.PathParameter("Type")
    Phone := request.PathParameter("Phone")
    Email := request.PathParameter("Email")
    Description := request.PathParameter("Description")
    Price := request.PathParameter("Price")
    
	decodedType, _ := base64.StdEncoding.DecodeString(Type)
	decodedPhone, _ := base64.StdEncoding.DecodeString(Phone)
	decodedEmail, _ := base64.StdEncoding.DecodeString(Email)
	decodedDescription, _ := base64.StdEncoding.DecodeString(Description)
	decodedPrice, _ := base64.StdEncoding.DecodeString(Price)

    // Add
    context := appengine.NewContext(request.Request)

    id, _ := uuid.NewV4()

    sell := Sell {
        Id:             id.String(),
        OwnerId:        UserId,
        Type:           string(decodedType),
        Phone:          string(decodedPhone),
        Email:          string(decodedEmail),
        Description:    string(decodedDescription),
        Price:          string(decodedPrice),
	    WantCount:      0,
    }

    _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "Sell", nil), &sell)
    if err != nil {
        log.Printf("APP_ERROR: %s", err.Error())
        SendString(response, "")
        return
    }
        
    SendString(response, id.String())
}
func ServiceHandlers_AddSearch(request *restful.Request, response *restful.Response) {

    // Input
    UserId := request.PathParameter("UserId")
    Type := request.PathParameter("Type")
    Phone := request.PathParameter("Phone")
    Email := request.PathParameter("Email")
    Description := request.PathParameter("Description")
    Price := request.PathParameter("Price")

	decodedType, _ := base64.StdEncoding.DecodeString(Type)
	decodedPhone, _ := base64.StdEncoding.DecodeString(Phone)
	decodedEmail, _ := base64.StdEncoding.DecodeString(Email)
	decodedDescription, _ := base64.StdEncoding.DecodeString(Description)
	decodedPrice, _ := base64.StdEncoding.DecodeString(Price)

    // Add
    context := appengine.NewContext(request.Request)

    id, _ := uuid.NewV4()

    search := Search {
        Id:             id.String(),
        OwnerId:        UserId,
        Type:           string(decodedType),
        Phone:          string(decodedPhone),
        Email:          string(decodedEmail),
        Description:    string(decodedDescription),
        Price:          string(decodedPrice),
	    WantCount:      0,
    }

    _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "Search", nil), &search)
    if err != nil {
        log.Printf("APP_ERROR: %s", err.Error())
        SendString(response, "")
        return
    }
        
    SendString(response, id.String())
}


// Remove
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_RemoveBorrow(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    OwnerId := request.PathParameter("OwnerId")

    context := appengine.NewContext(request.Request)

    keys, err := datastore.NewQuery("Borrow").
        KeysOnly().
        Ancestor(defaultKey(context, "Borrow")).
        Filter("Id=", ItemId).
        Filter("OwnerId=", OwnerId).
        GetAll(context, nil)

    if err != nil {
        SendString(response, "")
        return
    }

    datastore.DeleteMulti(context, keys)

    SendString(response, "")
}
func ServiceHandlers_RemoveSell(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    OwnerId := request.PathParameter("OwnerId")

    context := appengine.NewContext(request.Request)

    keys, err := datastore.NewQuery("Sell").
        KeysOnly().
        Ancestor(defaultKey(context, "Sell")).
        Filter("Id=", ItemId).
        Filter("OwnerId=", OwnerId).
        GetAll(context, nil)

    if err != nil {
        SendString(response, "")
        return
    }

    datastore.DeleteMulti(context, keys)

    SendString(response, "")
}
func ServiceHandlers_RemoveSearch(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    OwnerId := request.PathParameter("OwnerId")

    context := appengine.NewContext(request.Request)

    keys, err := datastore.NewQuery("Search").
        KeysOnly().
        Ancestor(defaultKey(context, "Search")).
        Filter("Id=", ItemId).
        Filter("OwnerId=", OwnerId).
        GetAll(context, nil)

    if err != nil {
        SendString(response, "")
        return
    }

    datastore.DeleteMulti(context, keys)

    SendString(response, "")
}


// Load
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_LoadSell(request *restful.Request, response *restful.Response) {

    // Input
    //UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 5000

    // Search 1
    query1 := datastore.NewQuery("Sell").Limit(querySize)
    queryResult1 := make([]Sell, 0, querySize)
    query1.GetAll(context, &queryResult1)

    // Search 2
    query2 := datastore.NewQuery("SellWant").Limit(querySize)
    queryResult2 := make([]SellWant, 0, querySize)
    query2.GetAll(context, &queryResult2)

    // Update
    m := make(map[string]int)
    for i := 0; i < len(queryResult2); i++ {
        m[queryResult2[i].ItemId] = m[queryResult2[i].ItemId] + 1
    }

    for j := 0; j < len(queryResult1); j++ {
        queryResult1[j].WantCount = m[queryResult1[j].Id]
    }

    bytes, _ := json.Marshal(queryResult1)

    response.Write(bytes)
}
func ServiceHandlers_LoadSearch(request *restful.Request, response *restful.Response) {

    // Input
    //UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 5000

    // Search 1
    query1 := datastore.NewQuery("Search").Limit(querySize)
    queryResult1 := make([]Search, 0, querySize)
    query1.GetAll(context, &queryResult1)

    // Search 2
    query2 := datastore.NewQuery("SearchWant").Limit(querySize)
    queryResult2 := make([]SearchWant, 0, querySize)
    query2.GetAll(context, &queryResult2)

    // Update
    m := make(map[string]int)
    for i := 0; i < len(queryResult2); i++ {
        m[queryResult2[i].ItemId] = m[queryResult2[i].ItemId] + 1
    }

    for j := 0; j < len(queryResult1); j++ {
        queryResult1[j].WantCount = m[queryResult1[j].Id]
    }

    bytes, _ := json.Marshal(queryResult1)

    response.Write(bytes)
}
func ServiceHandlers_LoadBorrow(request *restful.Request, response *restful.Response) {

    // Input
    //UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 5000

    // Search 1
    query1 := datastore.NewQuery("Borrow").Limit(querySize)
    queryResult1 := make([]Borrow, 0, querySize)
    query1.GetAll(context, &queryResult1)

    // Search 2
    query2 := datastore.NewQuery("BorrowWant").Limit(querySize)
    queryResult2 := make([]BorrowWant, 0, querySize)
    query2.GetAll(context, &queryResult2)

    // Update
    m := make(map[string]int)
    for i := 0; i < len(queryResult2); i++ {
        m[queryResult2[i].ItemId] = m[queryResult2[i].ItemId] + 1
    }

    for j := 0; j < len(queryResult1); j++ {
        queryResult1[j].WantCount = m[queryResult1[j].Id]
    }

    bytes, _ := json.Marshal(queryResult1)

    response.Write(bytes)
}


// Want
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_WantBorrow(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 1

    // Search for valid user
    query := datastore.NewQuery("User").Limit(querySize)
    queryResult := make([]User, 0, querySize)
    query.GetAll(context, &queryResult)

    if len(queryResult) > 0 {
        id, _ := uuid.NewV4()

        brrowWant := BorrowWant {
            Id:     id.String(),
            ItemId: ItemId,
            UserId: UserId,
        }

        _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "BorrowWant", nil), &brrowWant)
        if err != nil {
            log.Printf("APP_ERROR: %s", err.Error())
            SendString(response, "")
            return
        }
    }

    SendString(response, "")
}
func ServiceHandlers_WantSell(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 1

    // Search for valid user
    query := datastore.NewQuery("User").Limit(querySize)
    queryResult := make([]User, 0, querySize)
    query.GetAll(context, &queryResult)

    if len(queryResult) > 0 {
        id, _ := uuid.NewV4()

        sellWant := SellWant {
            Id:     id.String(),
            ItemId: ItemId,
            UserId: UserId,
        }

        _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "SellWant", nil), &sellWant)
        if err != nil {
            log.Printf("APP_ERROR: %s", err.Error())
            SendString(response, "")
            return
        }
    }

    SendString(response, "")
}
func ServiceHandlers_WantSearch(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")
    UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)
    querySize := 1

    // Search for valid user
    query := datastore.NewQuery("User").Limit(querySize)
    queryResult := make([]User, 0, querySize)
    query.GetAll(context, &queryResult)

    if len(queryResult) > 0 {
        id, _ := uuid.NewV4()

        searchWant := SearchWant {
            Id:     id.String(),
            ItemId: ItemId,
            UserId: UserId,
        }

        _, err := datastore.Put(context, datastore.NewIncompleteKey(context, "SearchWant", nil), &searchWant)
        if err != nil {
            log.Printf("APP_ERROR: %s", err.Error())
            SendString(response, "")
            return
        }
    }

    SendString(response, "")
}


// Info
// ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ----
func ServiceHandlers_GetInterestedUsers(request *restful.Request, response *restful.Response) {

    // Input
    UserId := request.PathParameter("UserId")

    context := appengine.NewContext(request.Request)

    // Items
    var borrowIdList []string
    q1 := datastore.NewQuery("Borrow").Filter("OwnerId =", UserId)
    for t1 := q1.Run(context); ; {
        
        var x Borrow
        _, err := t1.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        borrowIdList = append(borrowIdList, x.Id)
    }

    var sellIdList []string
    q2 := datastore.NewQuery("Sell").Filter("OwnerId =", UserId)
    for t2 := q2.Run(context); ; {
        
        var x Sell
        _, err := t2.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        sellIdList = append(sellIdList, x.Id)
    }

    var searchIdList []string
    q3 := datastore.NewQuery("Search").Filter("OwnerId =", UserId)
    for t3 := q3.Run(context); ; {
        
        var x Search
        _, err := t3.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        searchIdList = append(searchIdList, x.Id)
    }

    // Wants
    var borrowWantList []BorrowWant
    q4 := datastore.NewQuery("BorrowWant")
    for t4 := q4.Run(context); ; {
        
        var x BorrowWant
        _, err := t4.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(borrowIdList); i++ {
            if x.ItemId == borrowIdList[i] {
                borrowWantList = append(borrowWantList, x)
                break
            }
        }
    }

    var sellWantList []SellWant
    q5 := datastore.NewQuery("SellWant")
    for t5 := q5.Run(context); ; {
        
        var x SellWant
        _, err := t5.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(sellIdList); i++ {
            if x.ItemId == sellIdList[i] {
                sellWantList = append(sellWantList, x)
                break
            }
        }
    }

    var searchWantList []SearchWant
    q6 := datastore.NewQuery("SearchWant")
    for t6 := q6.Run(context); ; {
        
        var x SearchWant
        _, err := t6.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(searchIdList); i++ {
            if x.ItemId == searchIdList[i] {
                searchWantList = append(searchWantList, x)
                break
            }
        }
    }

    SendInt(response, len(borrowWantList) + len(sellWantList) + len(searchWantList))
}
func ServiceHandlers_GetInterestedUsersToBorrow(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")

    context := appengine.NewContext(request.Request)

    var borrowWantList []BorrowWant
    q1 := datastore.NewQuery("BorrowWant").Filter("ItemId =", ItemId)
    for t1 := q1.Run(context); ; {
        
        var x BorrowWant
        _, err := t1.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        borrowWantList = append(borrowWantList, x)
    }

    var userList []User
    q2 := datastore.NewQuery("User")
    for t2 := q2.Run(context); ; {
        
        var x User
        _, err := t2.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(borrowWantList); i++ {
            if x.Id == borrowWantList[i].UserId {
                userList = append(userList, x)
                break
            }
        }
    }

    // Send
    bytes, _ := json.Marshal(userList)

    response.Write(bytes)
}
func ServiceHandlers_GetInterestedUsersToSell(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")

    context := appengine.NewContext(request.Request)

    var sellWantList []SellWant
    q1 := datastore.NewQuery("SellWant").Filter("ItemId =", ItemId)
    for t1 := q1.Run(context); ; {
        
        var x SellWant
        _, err := t1.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        sellWantList = append(sellWantList, x)
    }

    var userList []User
    q2 := datastore.NewQuery("User")
    for t2 := q2.Run(context); ; {
        
        var x User
        _, err := t2.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(sellWantList); i++ {
            if x.Id == sellWantList[i].UserId {
                userList = append(userList, x)
                break
            }
        }
    }

    // Send
    bytes, _ := json.Marshal(userList)

    response.Write(bytes)
}
func ServiceHandlers_GetInterestedUsersToSearch(request *restful.Request, response *restful.Response) {

    // Input
    ItemId := request.PathParameter("ItemId")

    context := appengine.NewContext(request.Request)

    var searchWantList []SearchWant
    q1 := datastore.NewQuery("SearchWant").Filter("ItemId =", ItemId)
    for t1 := q1.Run(context); ; {
        
        var x SearchWant
        _, err := t1.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        searchWantList = append(searchWantList, x)
    }

    var userList []User
    q2 := datastore.NewQuery("User")
    for t2 := q2.Run(context); ; {
        
        var x User
        _, err := t2.Next(&x)
        
        if err == datastore.Done {
            break
        }

        if err != nil {
            log.Printf("ServiceHandlers_GetInterestedUsers_ERROR: %v", err)
            return
        }

        for i := 0; i < len(searchWantList); i++ {
            if x.Id == searchWantList[i].UserId {
                userList = append(userList, x)
                break
            }
        }
    }

    // Send
    bytes, _ := json.Marshal(userList)

    response.Write(bytes)
}
