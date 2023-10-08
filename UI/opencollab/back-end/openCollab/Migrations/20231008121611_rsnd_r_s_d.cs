using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace openCollab.Migrations
{
    /// <inheritdoc />
    public partial class rsnd_r_s_d : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserReview_Projects_ProjectId",
                table: "UserReview");

            migrationBuilder.DropForeignKey(
                name: "FK_UserReview_Users_UserId",
                table: "UserReview");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserReview",
                table: "UserReview");

            migrationBuilder.RenameTable(
                name: "UserReview",
                newName: "UserReviews");

            migrationBuilder.RenameIndex(
                name: "IX_UserReview_UserId",
                table: "UserReviews",
                newName: "IX_UserReviews_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserReview_ProjectId",
                table: "UserReviews",
                newName: "IX_UserReviews_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserReviews",
                table: "UserReviews",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserReviews_Projects_ProjectId",
                table: "UserReviews",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserReviews_Users_UserId",
                table: "UserReviews",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserReviews_Projects_ProjectId",
                table: "UserReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_UserReviews_Users_UserId",
                table: "UserReviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserReviews",
                table: "UserReviews");

            migrationBuilder.RenameTable(
                name: "UserReviews",
                newName: "UserReview");

            migrationBuilder.RenameIndex(
                name: "IX_UserReviews_UserId",
                table: "UserReview",
                newName: "IX_UserReview_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserReviews_ProjectId",
                table: "UserReview",
                newName: "IX_UserReview_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserReview",
                table: "UserReview",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserReview_Projects_ProjectId",
                table: "UserReview",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserReview_Users_UserId",
                table: "UserReview",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
