using System.Text.Json.Serialization;

namespace Mercadona.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CategoryClass
    {
        Clothe = 1,
        Food = 2,
        Drink = 3,
    }

}