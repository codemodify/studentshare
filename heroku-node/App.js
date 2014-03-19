
require("./App.Implementation.js");
require("./App.Routes.js");
require("./App.Gcm.js");
require("./App.DataModels.js");

App.Configure();
App.DefineRoute("/RegisterUser/:Name/:Pass/:DeviceRegistrationId"               , App.Routes.Persister.RegisterUser);
App.DefineRoute("/LoginUser/:Name/:Pass/:DeviceRegistrationId"                  , App.Routes.Persister.LoginUser);
App.DefineRoute("/UpdateUserProfile/:UserId/:Email"                             , App.Routes.Persister.UpdateUserProfile);

App.DefineRoute("/ChatSendMessage/:UserId/:Message"                             , App.Routes.Persister.ChatSendMessage);
App.DefineRoute("/ChatGetMessages/:UserId/:LastMessageId"                       , App.Routes.Persister.ChatGetMessages);

App.DefineRoute("/AddBorrow/:UserId/:Type/:Phone/:Email/:Description/:Price"    , App.Routes.Persister.AddBorrow);
App.DefineRoute("/AddSell/:UserId/:Type/:Phone/:Email/:Description/:Price"      , App.Routes.Persister.AddSell);
App.DefineRoute("/AddSearch/:UserId/:Type/:Phone/:Email/:Description/:Price"    , App.Routes.Persister.AddSearch);

App.DefineRoute("/RemoveBorrow/:ItemId/:OwnerId"                                , App.Routes.Persister.RemoveBorrow);
App.DefineRoute("/RemoveSell/:ItemId/:OwnerId"                                  , App.Routes.Persister.RemoveSell);
App.DefineRoute("/RemoveSearch/:ItemId/:OwnerId"                                , App.Routes.Persister.RemoveSearch);

App.DefineRoute("/LoadSell/:UserId"                                             , App.Routes.Persister.LoadSell);
App.DefineRoute("/LoadSearch/:UserId"                                           , App.Routes.Persister.LoadSearch);
App.DefineRoute("/LoadBorrow/:UserId"                                           , App.Routes.Persister.LoadBorrow);

App.DefineRoute("/WantBorrow/:ItemId/:UserId"                                   , App.Routes.Persister.WantBorrow);
App.DefineRoute("/WantSell/:ItemId/:UserId"                                     , App.Routes.Persister.WantSell);
App.DefineRoute("/WantSearch/:ItemId/:UserId"                                   , App.Routes.Persister.WantSearch);

App.DefineRoute("/GetInterestedUsers/:UserId"                                   , App.Routes.Persister.GetInterestedUsers);
App.DefineRoute("/GetInterestedUsersToBorrow/:ItemId"                           , App.Routes.Persister.GetInterestedUsersToBorrow);
App.DefineRoute("/GetInterestedUsersToSell/:ItemId"                             , App.Routes.Persister.GetInterestedUsersToSell);
App.DefineRoute("/GetInterestedUsersToSearch/:ItemId"                           , App.Routes.Persister.GetInterestedUsersToSearch);

App.DefineRoute("/SaveDeviceRegistrationId/:DeviceRegistrationId"               , App.Routes.Persister.SaveDeviceRegistrationId);


/*
App.DefineRoute("/MyService1"               , App.Routes.MyService1             );
App.DefineRoute("/MyService2:v"             , App.Routes.MyService2             );
App.DefineRoute("/ReadFromDb"               , App.Routes.Persister.ReadFromDb   );
*/

App.DefineRoute("*"                         , App.Routes.GetStaticResource      );
App.Run();
